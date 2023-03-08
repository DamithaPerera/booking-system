import { HttpStatusCode } from "../../util/statusCode";
import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../../util/responseHandler";

const Joi = require("joi").extend(require("@joi/date"));
import moment from "moment";

/**
 * Validates the query parameters for the getAllHotels API endpoint.
 * @param req
 * @param res
 * @param next
 */
export const getAllHotelsValidation = (req: Request, res: Response, next: NextFunction) => {

  const schema = Joi.object({
    // Validate that check-in date is in the future and in the correct format.
    checkIn: Joi.date().format("YYYY-MM-DD").greater("now").label("checking should be done before current date").required(),
    // Validate that check-out date is after check-in date and in the correct format.
    checkOut: Joi.date().format("YYYY-MM-DD").greater(Joi.ref("checkIn")).required(),
    // Validate that page is a positive integer.
    page: Joi.number().min(1).required(),
    // Validate that perPage is an integer between 1 and 10.
    perPage: Joi.number().max(10).required()
  });
  // Validate the query parameters against the schema.
  const result = schema.validate(req.query);
  if (result.error) {
    // Return an error response if the validation fails.
    return ErrorResponse(res, { message: result.error.message }, HttpStatusCode.VALIDATION);
  } else {
    // Call the next middleware function if the validation succeeds.
    next();
  }

};

/**
 * This function validates the data sent in the request body for creating a hotel booking
 * @param req
 * @param res
 * @param next
 */
export const creatHotelBookingValidation = (req: Request, res: Response, next: NextFunction) => {
  // Define a validation schema using Joi
  const schema = Joi.object({
    HotelId: Joi.number().required(),
    RoomId: Joi.number().required(),
    CheckIn: Joi.date().format("YYYY-MM-DD").greater("now").label("checking should be done before current date").required(),
    CheckOut: Joi.date().format("YYYY-MM-DD").greater(Joi.ref("CheckIn")).required(),
    CustomerDetails: Joi.object({
      FirstName: Joi.string().required(),
      LastName: Joi.string().required(),
      Email: Joi.string().email().required(),
      PhoneNumber: Joi.string().required(),
      Payment: Joi.string().valid("SUCCESS", "FAILURE").required()
    }).required()
  });
  // Validate the request body using the schema
  const result = schema.validate(req.body);
  // If there are validation errors, return an error response with the error message
  if (result.error) {
    return ErrorResponse(res, { message: result.error.message }, HttpStatusCode.VALIDATION);
  } else {
    // If there are no errors, call the next middleware function
    next();
  }
};

/**
 * This function validates the data sent in the request body for updating a hotel booking
 * @param req
 * @param res
 * @param next
 */
export const updateHotelBookingValidation = (req: Request, res: Response, next: NextFunction) => {
  // Define a validation schema using Joi
  const schema = Joi.object({
    CheckIn: Joi.date().format("YYYY-MM-DD").greater("now").label("checking should be done before current date").required(),
    CheckOut: Joi.date().format("YYYY-MM-DD").greater(Joi.ref("CheckIn")).required(),
    CustomerDetails: Joi.object({
      FirstName: Joi.string().required(),
      LastName: Joi.string().required(),
      Email: Joi.string().email().required(),
      PhoneNumber: Joi.string().required(),
      Payment: Joi.string().valid("SUCCESS", "FAILURE").required()
    }).required()
  });
  // Validate the request body using the schema
  const result = schema.validate(req.body);
  // If there are validation errors, return an error response with the error message
  if (result.error) {
    return ErrorResponse(res, { message: result.error.message }, HttpStatusCode.VALIDATION);
  } else {
    // If there are no errors, call the next middleware function
    next();
  }
};

/**
 * This function validates the data sent in the request parameters for cancelling a hotel booking
 * @param req
 * @param res
 * @param next
 */
export const cancelHotelBookingValidation = (req: Request, res: Response, next: NextFunction) => {
  // Define a validation schema using Joi
  const schema = Joi.object({
    hotelId: Joi.number().required(),
    roomId: Joi.number().required(),
    bookingId: Joi.string().required()
  });

  // Validate the request parameters using the schema
  const result = schema.validate(req.params);
  // If there are validation errors, return an error response with the error message
  if (result.error) {
    return ErrorResponse(res, { message: result.error.message }, HttpStatusCode.VALIDATION);
  } else {
    // If there are no errors, call the next middleware function
    next();
  }

};