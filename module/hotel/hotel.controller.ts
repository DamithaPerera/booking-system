import { Request, Response } from "express";
import {
  cancelHotelBookingService,
  creatHotelBookingService,
  getAllHotelsService,
  updateHotelBookingService
} from "./hotel.service";
import { ErrorResponse, SuccessResponse } from "../../util/responseHandler";
import { HttpStatusCode } from "../../util/statusCode";

/**
 * This function is used to handle the HTTP GET request for fetching all hotels.
 * @param req
 * @param res
 */
export const getAllHotelsController = async (req: Request, res: Response) => {
  try {
    // Get the query parameters from the request
    const { checkIn, checkOut, page, perPage } = req.query;
    // Convert the values of 'page' and 'perPage' to numbers
    const currentPage = Number(page);
    const pageLimit = Number(perPage);
    // Call the 'getAllHotelsService' function to get the data for all hotels
    const data = await getAllHotelsService(<string>checkIn, <string>checkOut, currentPage, pageLimit);
    // Return the data as a success response
    return SuccessResponse(res, data, "Hotel Details", HttpStatusCode.OK);
  } catch (error) {
    // Return the error message as an error response if there is any error
    return ErrorResponse(res, { message: error }, HttpStatusCode.BAD_REQUEST);
  }
};
/**
 * This function is used to handle the HTTP POST request for creating a hotel booking.
 * @param req
 * @param res
 */
export const creatHotelBookingController = async (req: Request, res: Response) => {
  try {
    // Get the request body from the request
    const requestBody = req.body;
    // Call the 'creatHotelBookingService' function to create a booking
    const data = await creatHotelBookingService(requestBody);
    // Return the data as a success response
    return SuccessResponse(res, data, "Booking Created Successfully", HttpStatusCode.CREATED);
  } catch (error) {
    // Return the error message as an error response if there is any error
    return ErrorResponse(res, { message: error }, HttpStatusCode.BAD_REQUEST);
  }
};

/**
 * This function is used to handle the HTTP PUT request for updating a hotel booking
 * @param req
 * @param res
 */
export const updateHotelBookingController = async (req: Request, res: Response) => {
  try {
    // Get the parameters from the request URL
    const { hotelId, roomId, bookingId } = req.params;
    // Get the request body from the request
    const requestBody = req.body;
    // Call the 'updateHotelBookingService' function to update the booking
    const data = await updateHotelBookingService(requestBody, +hotelId, +roomId, bookingId);
    // Return the data as a success response
    return SuccessResponse(res, data, "Booking Updated Successfully", HttpStatusCode.OK);
  } catch (error) {
    // Return the error message as an error response if there is any error
    return ErrorResponse(res, { message: error }, HttpStatusCode.BAD_REQUEST);
  }
};

/**
 * This function is used to handle the HTTP DELETE request for canceling a hotel booking.
 * @param req
 * @param res
 */
export const cancelHotelBookingController = async (req: Request, res: Response) => {
  try {
    // Get the parameters from the request URL
    const { hotelId, roomId, bookingId } = req.params;
    // Call the 'cancelHotelBookingService' function to cancel the booking
    const data = await cancelHotelBookingService(+hotelId, +roomId, bookingId);
    // Return the data as a success response
    return SuccessResponse(res, data, "Booking Canceled Successfully", HttpStatusCode.OK);
  } catch (error) {
    // Return the error message as an error response if there is any error
    return ErrorResponse(res, { message: error }, HttpStatusCode.BAD_REQUEST);
  }
};
