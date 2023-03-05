import {Router} from 'express';
import {getAllHotelsController} from './hotel.controller';
import {getAllHotelsValidation} from "./hotel.validation";


const routes = Router();


routes.get('/all', getAllHotelsValidation, getAllHotelsController);


export default routes;