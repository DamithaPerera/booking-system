import {createBookingRepo, getAllBookingRepo, getAllHotelsRepo} from "./hotel.repository";
import {Booking} from "../../interface/Booking";
import {Hotel} from "../../interface/hotel";


export const getAllHotelsService = async (checkIn: string, checkOut: string) => {
    const {Booking} = await getAllBookingRepo();
    const {Hotels} = await getAllHotelsRepo()

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
    }))
};

export const creatHotelBookingService = async (requestBody: Booking) => {
    const {Booking}  = await getAllBookingRepo();
    const { Hotels } = await getAllHotelsRepo();

    const hotelObj: Hotel[] = Hotels;
    const bookingObj: Booking[] = Booking;

    const data = validateBooking(requestBody, hotelObj, bookingObj );
    if (data) {
        console.log('sd')
        await createBookingRepo(requestBody)
    }
    return data
}

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


