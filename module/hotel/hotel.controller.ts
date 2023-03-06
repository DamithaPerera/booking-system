import {Request, Response} from 'express';
import {creatHotelBookingService, getAllHotelsService} from "./hotel.service";
import {ErrorResponse, SuccessResponse} from "../../util/responseHandler";


export const getAllHotelsController = async (req: Request, res: Response) => {
    try {
        const {checkIn, checkOut} = req.query
        const data = await getAllHotelsService(<string>checkIn, <string>checkOut)
        return SuccessResponse(res, data, 'Hotel Details', 200);
    } catch (error) {
        return ErrorResponse(res, {message: error}, 400);
    }
}

export const creatHotelBookingController = async (req: Request, res: Response) => {
    try {
        const requestBody = req.body
        const data = await creatHotelBookingService(requestBody)
        return SuccessResponse(res, data, 'Booking Created', 201);
    } catch (error) {
        return ErrorResponse(res, error, 400);
    }
}

