import {getAllBookingRepo, getAllHotelsRepo} from "./hotel.repository";


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