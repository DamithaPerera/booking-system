import hotelData from '../../data/hotel.data.json';
import bookingData from '../../data/booking.data.json';


export const getAllHotelsRepo = async () => {
    return hotelData
};

export const getAllBookingRepo = async () => {
    return bookingData
};