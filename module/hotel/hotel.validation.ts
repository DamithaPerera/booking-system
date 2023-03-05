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