import {Router} from 'express';
import {creatHotelBookingController, getAllHotelsController} from './hotel.controller';
import {creatHotelBookingValidation, getAllHotelsValidation} from "./hotel.validation";


const routes = Router();


routes.get('/all', getAllHotelsValidation, getAllHotelsController);
routes.post('/booking', creatHotelBookingValidation, creatHotelBookingController);


export default routes;