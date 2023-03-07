import hotelData from '../../data/hotel.data.json';
import {Booking} from "../../interface/Booking";
import path from 'path';
import fs from 'fs';

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
    return fs.writeFileSync(bookingsPath, updatedJSON);
};

export const cancelBookingRepo = async (bookingData: any) => {
    return fs.writeFileSync(bookingsPath, JSON.stringify(bookingData, null, 2));

};