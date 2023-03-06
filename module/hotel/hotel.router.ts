import {Router} from 'express';
import {creatHotelBookingController, getAllHotelsController} from './hotel.controller';
import {getAllHotelsValidation} from "./hotel.validation";


const routes = Router();


routes.get('/all', getAllHotelsValidation, getAllHotelsController);
routes.post('/booking', creatHotelBookingController);


export default routes;