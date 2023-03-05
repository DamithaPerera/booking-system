import {Router} from 'express';
import {getAllHotelsController} from './hotel.controller';


const routes = Router();


routes.get('/all',  getAllHotelsController);



export default routes;