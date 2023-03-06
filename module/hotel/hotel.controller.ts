import {Request, Response} from 'express';
import {
    cancelHotelBookingService,
    creatHotelBookingService,
    getAllHotelsService,
    updateHotelBookingService
} from "./hotel.service";
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
        return SuccessResponse(res, data, 'Booking Created Successfully', 201);
    } catch (error) {
        return ErrorResponse(res, error, 400);
    }
}

export const updateHotelBookingController = async (req: Request, res: Response) => {
    try {
        const {hotelId, roomId, bookingId} = req.params
        const requestBody = req.body
        const data = await updateHotelBookingService(requestBody, +hotelId, +roomId, bookingId)
        return SuccessResponse(res, data, 'Booking Updated Successfully', 200);
    } catch (error) {
        return ErrorResponse(res, error, 400);
    }
}

export const cancelHotelBookingController = async (req: Request, res: Response) => {
    try {
        const {hotelId, roomId, bookingId} = req.params
        const data = await cancelHotelBookingService(+hotelId, +roomId, bookingId)
        return SuccessResponse(res, data, 'Booking Canceled Successfully', 200);
    } catch (error) {
        return ErrorResponse(res, error, 400);
    }
}
