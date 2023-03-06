const Joi = require('joi').extend(require('@joi/date'));
import {NextFunction, Request, Response} from 'express';
import {ErrorResponse} from "../../util/responseHandler";
import moment from 'moment';


export const getAllHotelsValidation = (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        checkIn: Joi.date().format('YYYY-MM-DD').greater('now').required(),
        checkOut: Joi.date().format('YYYY-MM-DD').greater(Joi.ref('checkIn')).required()
    });

    const result = schema.validate(req.query);
    if (result.error) {
        return ErrorResponse(res, {message: result.error.message}, 422);
    } else {
        next()
    }

};

export const creatHotelBookingValidation = (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        HotelId: Joi.number().required(),
        RoomId: Joi.number().required(),
        CheckIn: Joi.date().format('YYYY-MM-DD').greater('now').required(),
        CheckOut: Joi.date().format('YYYY-MM-DD').greater(Joi.ref('CheckIn')).required(),
        CustomerDetails: Joi.object({
            FirstName: Joi.string().required(),
            LastName: Joi.string().required(),
            Email: Joi.string().email().required(),
            PhoneNumber: Joi.string().required(),
            Payment: Joi.string().valid('SUCCESS', 'FAILURE').required()
        }).required()
    });

    const result = schema.validate(req.body);
    if (result.error) {
        return ErrorResponse(res, {message: result.error.message}, 422);
    } else {
        next()
    }

};

export const updateHotelBookingValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        CheckIn: Joi.date().format('YYYY-MM-DD').greater('now').required(),
        CheckOut: Joi.date().format('YYYY-MM-DD').greater(Joi.ref('CheckIn')).required(),
        CustomerDetails: Joi.object({
            FirstName: Joi.string().required(),
            LastName: Joi.string().required(),
            Email: Joi.string().email().required(),
            PhoneNumber: Joi.string().required(),
            Payment: Joi.string().valid('SUCCESS', 'FAILURE').required()
        }).required()
    });

    const result = schema.validate(req.body);
    if (result.error) {
        return ErrorResponse(res, {message: result.error.message}, 422);
    } else {
        next()
    }
};

export const cancelHotelBookingValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        hotelId: Joi.number().required(),
        roomId: Joi.number().required(),
        bookingId: Joi.string().required()
    });

    const result = schema.validate(req.params);
    if (result.error) {
        return ErrorResponse(res, {message: result.error.message}, 422);
    }
    next()

};