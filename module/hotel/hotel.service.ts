import {
    cancelBookingRepo,
    createBookingRepo,
    getAllBookingRepo,
    getAllHotelsRepo,
    getBookingRepo,
    updateBookingRepo
} from "./hotel.repository";
import {Booking} from "../../interface/Booking";
import {Hotel} from "../../interface/hotel";
import {v4 as uuidv4} from 'uuid';
import cache from "../../util/cache";


export const getAllHotelsService = async (checkIn: string, checkOut: string) => {
    const {Booking, Hotels} = await getCacheForBookingsAndHotels()

    // Define the date range to check availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Find all booked room IDs within the date range
    const bookedRoomIds = Booking
        .filter((booking) => {
            const bookingCheckInDate = new Date(booking.CheckIn);
            const bookingCheckOutDate = new Date(booking.CheckOut);
            return (
                bookingCheckInDate < checkOutDate && bookingCheckOutDate > checkInDate
            );
        })
        .map((booking) => booking.RoomId);

    // Filter out all rooms that are already booked within the date range
    return Hotels.map((hotel) => ({
        ...hotel,
        Rooms: hotel.Rooms.filter((room) => !bookedRoomIds.includes(room.RoomId)),
    }));
};

export const creatHotelBookingService = async (requestBody: Booking) => {
    const {Booking, Hotels} = await getCacheForBookingsAndHotels()
    const data = validateBooking(requestBody, Hotels, Booking);
    if (data) {
        requestBody.BookingId = uuidv4();
        await createBookingRepo(requestBody);
    }
    return {
        "Booking Id": requestBody.BookingId
    }
}


const getCacheForBookingsAndHotels = async () => {
    let getHotelCache = cache.get("getHotels");
    let getBookingCache = cache.get("getBookings");

    let Booking: Booking[] = [];
    let Hotels: Hotel[] = [];

    if (!getHotelCache || !getBookingCache) {
        let data = await Promise.all([getAllBookingRepo(), getAllHotelsRepo()]);
        Booking = data[0].Booking;
        Hotels = data[1].Hotels;

        cache.set("getBookings", Booking);
        cache.set("getHotels", Hotels);
    } else {
        // @ts-ignore
        Booking = getBookingCache;
        // @ts-ignore
        Hotels = getHotelCache;
    }

    return {
        Booking, Hotels
    }

};

function validateBooking(booking: Booking, hotels: Hotel[], bookings: Booking[]): boolean {
    const hotel = hotels.find((h) => h.HotelId === booking.HotelId);
    if (!hotel) {
        throw new Error(`Error: Hotel with ID ${booking.HotelId} does not exist.`)
    }

    const room = hotel.Rooms.find((r) => r.RoomId === booking.RoomId);
    if (!room) {
        throw new Error(`Error: Room with ID ${booking.RoomId} does not exist in hotel ${booking.HotelId}.`)
    }

    const conflictingBooking = bookings.find(
        (b) =>
            b.HotelId === booking.HotelId &&
            b.RoomId === booking.RoomId &&
            ((new Date(b.CheckIn) >= new Date(booking.CheckIn) && new Date(b.CheckIn) < new Date(booking.CheckOut)) ||
                (new Date(b.CheckOut) > new Date(booking.CheckIn) && new Date(b.CheckOut) <= new Date(booking.CheckOut)))
    );
    if (conflictingBooking) {
        throw new Error(`Error: Room with ID ${booking.RoomId} in hotel ${booking.HotelId} is not available during the specified date range.`)
    }

    const checkInDate = new Date(booking.CheckIn);
    const checkOutDate = new Date(booking.CheckOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
        throw new Error(`Error: Invalid date range specified.`)
    }

    return true;
}

export const updateHotelBookingService = async (requestBody: Booking, hotelId: number, roomId: number, bookingId: string) => {
    const bookings = await getBookingRepo();
    // Find the index of the booking to update based on HotelId and RoomId
    const bookingIndex = bookings.Booking.findIndex((b: Booking) => b.HotelId === hotelId && b.RoomId === roomId && b.BookingId === bookingId);

    if (bookingIndex === -1) {
        throw new Error(`Booking not found for hotelId ${hotelId}, roomId ${roomId} and bookingId ${bookingId}`);
    }

    requestBody.HotelId = hotelId
    requestBody.RoomId = roomId
    requestBody.BookingId = bookingId

    // Update the booking at the found index
    bookings.Booking[bookingIndex] = requestBody;

    // Write the updated JSON back to the file
    const updatedJSON = JSON.stringify(bookings, null, 2);
    await updateBookingRepo(updatedJSON);
    return requestBody;
}


export const cancelHotelBookingService = async (hotelId: number, roomId: number, bookingId: string) => {
    const bookingData = await getBookingRepo();
    const index = bookingData.Booking.findIndex(
        (booking: Booking) => booking.HotelId === hotelId && booking.RoomId === roomId && booking.BookingId === bookingId
    );

    if (index === -1) {
        throw new Error(`Booking not found for hotelId ${hotelId}, roomId ${roomId} and bookingId ${bookingId}`);
    }

    bookingData.Booking.splice(index, 1);
    await cancelBookingRepo(bookingData)
}
