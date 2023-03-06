import {Router} from 'express';
import {creatHotelBookingController, getAllHotelsController, updateHotelBookingController} from './hotel.controller';
import {creatHotelBookingValidation, getAllHotelsValidation, updateHotelBookingValidation} from "./hotel.validation";


const routes = Router();


routes.get('/all', getAllHotelsValidation, getAllHotelsController);
routes.post('/booking', creatHotelBookingValidation, creatHotelBookingController);
routes.put('/booking/:hotelId/:roomId', updateHotelBookingValidation, updateHotelBookingController);


export default routes;