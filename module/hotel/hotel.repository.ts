import hotelData from '../../data/hotel.data.json';
import {Booking} from "../../interface/Booking";
import path from 'path';
import fs from 'fs';
import cache from "../../util/cache";

const bookingsPath = path.join(__dirname, '..', '..', 'data', 'booking.data.json');


export const getAllHotelsRepo = async () => {
    return hotelData
};

export const getAllBookingRepo = async () => {
    const bookingsJSON = fs.readFileSync(bookingsPath, 'utf-8');
    return JSON.parse(bookingsJSON)
};


export const createBookingRepo = async (requestBody: Booking) => {
    const bookingsJSON = fs.readFileSync(bookingsPath, 'utf-8');
    const bookings = JSON.parse(bookingsJSON);
    bookings.Booking.push(requestBody);

    const updatedJSON = JSON.stringify(bookings, null, 2);

    fs.writeFileSync(bookingsPath, updatedJSON);
};

export const getBookingRepo = async () => {
    const bookingsJSON = fs.readFileSync(bookingsPath, 'utf-8');
    return JSON.parse(bookingsJSON)
};

export const updateBookingRepo = async (updatedJSON: string | NodeJS.ArrayBufferView) => {
    cache.del("getBookings");
    cache.set("getBookings", updatedJSON);
    return fs.writeFileSync(bookingsPath, updatedJSON);
};

export const cancelBookingRepo = async (bookingData: any) => {
    cache.del("getBookings");
    const updatedJSON = JSON.stringify(bookingData, null, 2);
    cache.set("getBookings", updatedJSON);
    return fs.writeFileSync(bookingsPath, updatedJSON);

};