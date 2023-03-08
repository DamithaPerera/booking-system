import {
  cancelBookingRepo,
  createBookingRepo,
  getAllBookingRepo,
  getAllHotelsRepo,
  updateBookingRepo
} from "./hotel.repository";
import { Booking } from "../../interface/Booking";
import { Hotel } from "../../interface/hotel";
import { BookingData } from "../../interface/bookingData";
import { v4 as uuidv4 } from "uuid";
import cache from "../../util/cache";

/**
 * This function retrieves a list of available hotels for a given date range and
 * pagination parameters.
 * @param checkIn
 * @param checkOut
 * @param page
 * @param perPage
 */
export const getAllHotelsService = async (checkIn: string, checkOut: string, page: number, perPage: number) => {
  // Retrieve cached data for Bookings and Hotels
  const { Booking, Hotels } = await getCacheForBookingsAndHotels();

  // Define the date range to check availability based on the check-in and check-out dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Find all booked room IDs within the date range
  const bookedRoomIds = Booking.filter((booking) => {
    const bookingCheckInDate = new Date(booking.CheckIn);
    const bookingCheckOutDate = new Date(booking.CheckOut);
    // Filter bookings where there is a conflict with the requested date range
    return bookingCheckInDate < checkOutDate && bookingCheckOutDate > checkInDate;
  }).map((booking) => booking.RoomId);

  // Filter out all rooms that are already booked within the requested date range
  const availableHotels = Hotels.map((hotel) => ({
    ...hotel,
    Rooms: hotel.Rooms.filter((room) => !bookedRoomIds.includes(room.RoomId))
  }));

  // Calculate the start and end indexes for the current page
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Return the hotels for the current page, based on the calculated start and end indexes
  return availableHotels.slice(startIndex, endIndex);
};

/**
 * Create Hotel Booking Service
 * @param requestBody
 * This function creates a new hotel booking by generating a unique BookingId,
 * validating the request against cached data for Bookings and Hotels, and
 * then creating the new booking in the database via createBookingRepo.
 */
export const creatHotelBookingService = async (requestBody: Booking) => {
  // Retrieve cached data for Bookings and Hotels
  const { Booking, Hotels } = await getCacheForBookingsAndHotels();

  // Validate the booking request using cached data for Hotels and existing Bookings
  validateBooking(requestBody, Hotels, Booking);

  // Generate a new unique BookingId using the uuidv4 library
  requestBody.BookingId = uuidv4();

  // Create the new booking in the database via the createBookingRepo function
  await createBookingRepo(requestBody);

  // Return the newly created BookingId as a success message
  return {
    "Booking Id": requestBody.BookingId
  };
};

/**
 * This function validates a booking request by checking if the hotel and room exist,
 * if the room is available during the requested date range, and if the date range is valid.
 * @param booking
 * @param hotels
 * @param bookings
 */
function validateBooking(booking: Booking, hotels: Hotel[], bookings: Booking[]) {
  console.log('1booking=>', booking)
  console.log('1hotels=>', hotels)
  console.log('1bookings=>', bookings)
  // Check if the hotel specified in the booking request exists
  const hotel = hotels.find(h => h.HotelId === booking.HotelId);
  if (!hotel) {
    throw new Error(`Error: Hotel with ID ${booking.HotelId} does not exist.`);
  }

  // Check if the room specified in the booking request exists within the specified hotel
  const room = hotel.Rooms.find(r => r.RoomId === booking.RoomId);
  if (!room) {
    throw new Error(`Error: Room with ID ${booking.RoomId} does not exist in hotel ${booking.HotelId}.`);
  }

  // Check if the requested room is available during the requested date range
  const bookingsArray = Array.from(bookings);
  const conflictingBooking = bookingsArray.find(b =>
    b.HotelId === booking.HotelId &&
    b.RoomId === booking.RoomId &&
    ((new Date(b.CheckIn) >= new Date(booking.CheckIn) && new Date(b.CheckIn) < new Date(booking.CheckOut)) ||
      (new Date(b.CheckOut) > new Date(booking.CheckIn) && new Date(b.CheckOut) <= new Date(booking.CheckOut)))
  );
  console.log('conflict', conflictingBooking)
  if (conflictingBooking) {
    throw new Error(`Error: Room with ID ${booking.RoomId} in hotel ${booking.HotelId} is not available during the specified date range.`);
  }

  // Check if the specified date range is valid
  const checkInDate = new Date(booking.CheckIn);
  const checkOutDate = new Date(booking.CheckOut);
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
    throw new Error(`Error: Invalid date range specified.`);
  }
}

/**
 * Update an existing hotel booking
 * @param requestBody
 * @param hotelId
 * @param roomId
 * @param bookingId
 */
export const updateHotelBookingService = async (requestBody: Booking, hotelId: number, roomId: number, bookingId: string) => {
  // Get the cached booking and hotel data
  const bookings: BookingData = await getCacheForBookingsAndHotels();
  // Find the index of the booking to update based on HotelId, RoomId, and BookingId
  const bookingIndex = bookings.Booking.findIndex((b: Booking) => b.HotelId === hotelId && b.RoomId === roomId && b.BookingId === bookingId);

  // Throw an error if the booking to update is not found
  if (bookingIndex === -1) {
    throw new Error(`Booking not found for hotelId ${hotelId}, roomId ${roomId} and bookingId ${bookingId}`);
  }

  // Update the fields of the booking at the found index
  bookings.Booking[bookingIndex].CheckIn = requestBody.CheckIn;
  bookings.Booking[bookingIndex].CheckOut = requestBody.CheckOut;
  bookings.Booking[bookingIndex].CustomerDetails = requestBody.CustomerDetails;

  // Remove the Hotels property from the cached data (not needed for updating bookings)
  delete bookings.Hotels;

  // Write the updated JSON back to the file
  const updatedJSON = JSON.stringify(bookings, null, 2);
  await updateBookingRepo(updatedJSON);

  // Return the updated booking information
  return bookings.Booking[bookingIndex];
};


/**
 * cancelHotelBookingService
 * @param hotelId
 * @param roomId
 * @param bookingId
 */
export const cancelHotelBookingService = async (hotelId: number, roomId: number, bookingId: string) => {
  //get the booking data from cache
  const bookingData: BookingData = await getCacheForBookingsAndHotels();

  //the `Booking` array inside the `bookingData` object to find the index of the
  // booking object that matches the specified `hotelId`, `roomId`, and `bookingId`.
  const index = bookingData.Booking.findIndex(
    (booking: Booking) => booking.HotelId === hotelId && booking.RoomId === roomId && booking.BookingId === bookingId
  );

  // If the `findIndex()` method returns `-1`, it means that no booking object was found that matches the specified
  // `hotelId`, `roomId`, and `bookingId`. In that case, an error is thrown.
  if (index === -1) {
    throw new Error(`Booking not found for hotelId ${hotelId}, roomId ${roomId} and bookingId ${bookingId}`);
  }

  // The `Hotels` property is deleted from the `bookingData` object to remove any hotel data that might have been cached.
  delete bookingData.Hotels;

  // The `splice()` method is called on the `Booking` array inside the `bookingData` object to remove the booking object
  // that matches the specified `hotelId`, `roomId`, and `bookingId`
  bookingData.Booking.splice(index, 1);

  // update the booking data in the database with the modified `bookingData` object.
  await cancelBookingRepo(bookingData);
};


/**
 *This function is used to get the cached data for bookings and hotels. If there
 * is no cached data, it will fetch data from the repository and store it in cache.
 */
export const getCacheForBookingsAndHotels = async () => {
  // Get the cached data for hotels and bookings
  const getHotelCache = cache.get<Hotel[]>("getHotels");
  const getBookingCache = cache.get<Booking[]>("getBookings");

  // Set the cached data to empty arrays if there is no cached data available
  let Booking: Booking[] = getBookingCache ?? [];
  let Hotels: Hotel[] = getHotelCache ?? [];

  // If there is no cached data available, fetch data from the repository and store it in cache
  if (!getHotelCache || !getBookingCache) {
    console.log('cache called')
    // Fetch data for bookings and hotels from the repository
    const [bookingData, hotelsData] = await Promise.all([
      getAllBookingRepo(),
      getAllHotelsRepo()
    ]);

    // Set the fetched data to variables
    Booking = bookingData.Booking;
    Hotels = hotelsData.Hotels;

    // Store the fetched data in cache
    cache.set("getBookings", Booking);
    cache.set("getHotels", Hotels);
  }

  // Return the data for bookings and hotels
  return { Booking, Hotels };
};