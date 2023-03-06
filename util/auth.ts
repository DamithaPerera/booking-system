import {NextFunction, Request, Response} from 'express';
import {token} from "../util/token.json";
import {ErrorResponse} from "./responseHandler";
import {HttpStatusCode} from './statusCode';

/**
 * Simple Authentication
 * @param req
 * @param res
 * @param next
 * @Description Checks the JWT token is in the header or not
 */
export const authRequest = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers["authorization"]?.replace("Bearer", "").trim();
    if (!authHeader || authHeader !== token) {
        return ErrorResponse(res, {message: authHeader ? 'Invalid Token' : 'Missing Token'}, HttpStatusCode.FORBIDDEN);
    }
    next();
}