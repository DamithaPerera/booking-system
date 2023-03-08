import hotelData from "../../data/hotel.data.json";
import { Booking } from "../../interface/Booking";
import path from "path";
import fs from "fs";
import cache from "../../util/cache";

const bookingsPath = path.join(__dirname, "..", "..", "data", "booking.data.json");

/**
 * Returns all hotels data.
 */
export const getAllHotelsRepo = async () => {
  // Return the hotelData array.
  return hotelData;
};

/**
 * Returns all booking data by reading from a JSON file.
 */
export const getAllBookingRepo = async () => {
  // Read the bookings data from the JSON file.
  const bookingsJSON = fs.readFileSync(bookingsPath, "utf-8");
  // Convert the JSON string to an array of objects and return it
  return JSON.parse(bookingsJSON);
};

/**
 * Creates a new booking by adding it to the bookings data array and writing the
 * updated data to a JSON file.
 * @param requestBody
 */
export const createBookingRepo = async (requestBody: Booking) => {
  // Remove the old data from the cache.
  cache.del("getBookings");
  // Read the bookings data from the JSON file.
  const bookingsJSON = fs.readFileSync(bookingsPath, "utf-8");
  // Convert the JSON string to an array of objects.
  const bookings = JSON.parse(bookingsJSON);
  // Add the new booking to the bookings data array.
  bookings.Booking.push(requestBody);

  // Convert the updated bookings data to a JSON string.
  const updatedJSON = JSON.stringify(bookings, null, 2);

  // Write the updated bookings data to the JSON file.
  fs.writeFileSync(bookingsPath, updatedJSON);
};

/**
 * Reads and returns the booking data from a JSON file.
 */
export const getBookingRepo = async () => {
  // Read the bookings data from the JSON file.
  const bookingsJSON = fs.readFileSync(bookingsPath, "utf-8");
  // Convert the JSON string to an array of objects and return it.
  return JSON.parse(bookingsJSON);
};

/**
 * Updates the booking data by writing the updated data to a JSON file and updating the cache.
 * @param updatedJSON
 */
export const updateBookingRepo = async (updatedJSON: string | NodeJS.ArrayBufferView) => {
  // Remove the old data from the cache.
  cache.del("getBookings");
  // Add the updated data to the cache.
  cache.set("getBookings", updatedJSON);
  // Write the updated data to the JSON file.
  return fs.writeFileSync(bookingsPath, updatedJSON);
};

/**
 * Cancels a booking by updating the booking data and writing the updated data
 * to a JSON file and the cache.
 * @param bookingData
 */
export const cancelBookingRepo = async (bookingData: any) => {
  // Remove the old data from the cache.
  cache.del("getBookings");
  // Convert the updated data to a JSON string.
  const updatedJSON = JSON.stringify(bookingData, null, 2);
  // Add the updated data to the cache.
  cache.set("getBookings", updatedJSON);
  // Write the updated data to the JSON file.
  return fs.writeFileSync(bookingsPath, updatedJSON);
};