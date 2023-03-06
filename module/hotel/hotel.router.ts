import {Router} from 'express';
import {
    cancelHotelBookingController,
    creatHotelBookingController,
    getAllHotelsController,
    updateHotelBookingController
} from './hotel.controller';
import {creatHotelBookingValidation, getAllHotelsValidation, updateHotelBookingValidation} from "./hotel.validation";


const routes = Router();


routes.get('/all', getAllHotelsValidation, getAllHotelsController);
routes.post('/booking', creatHotelBookingValidation, creatHotelBookingController);
routes.put('/booking/:hotelId/:roomId/:bookingId', updateHotelBookingValidation, updateHotelBookingController);
routes.delete('/booking/:hotelId/:roomId/:bookingId', cancelHotelBookingController);


export default routes;