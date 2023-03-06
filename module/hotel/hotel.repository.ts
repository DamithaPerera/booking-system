import hotelData from '../../data/hotel.data.json';
import bookingData from '../../data/booking.data.json';
import {Booking} from "../../interface/Booking";
import path from 'path';
import fs from 'fs';


export const getAllHotelsRepo = async () => {
    return hotelData
};

export const getAllBookingRepo = async () => {
    return bookingData
};

const bookingsPath = path.join(__dirname, '..', '..', 'data', 'booking.data.json');

export const createBookingRepo = async (requestBody: Booking) => {
    const bookingsJSON = fs.readFileSync(bookingsPath, 'utf-8');
    const bookings = JSON.parse(bookingsJSON);
    bookings.Booking.push(requestBody);

    const updatedJSON = JSON.stringify(bookings, null, 2);

    fs.writeFileSync(bookingsPath, updatedJSON);
};