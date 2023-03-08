import {Router} from "express";
import {
    cancelHotelBookingController,
    creatHotelBookingController,
    getAllHotelsController,
    updateHotelBookingController
} from "./hotel.controller";
import {
    cancelHotelBookingValidation,
    creatHotelBookingValidation,
    getAllHotelsValidation,
    updateHotelBookingValidation
} from "./hotel.validation";

// Create a new router instance
const routes = Router();

// Define the routes and their corresponding controller and validation functions
routes.get("/all", getAllHotelsValidation, getAllHotelsController);
routes.post("/booking", creatHotelBookingValidation, creatHotelBookingController);
routes.put("/booking/:hotelId/:roomId/:bookingId", updateHotelBookingValidation, updateHotelBookingController);
routes.delete("/booking/:hotelId/:roomId/:bookingId", cancelHotelBookingValidation, cancelHotelBookingController);


export default routes;