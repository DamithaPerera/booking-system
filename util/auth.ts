import {NextFunction, Request, Response} from "express";
import {token} from "../util/token.json";
import {ErrorResponse} from "./responseHandler";
import {HttpStatusCode} from "./statusCode";

/**
 * Simple Authentication
 * @param req
 * @param res
 * @param next
 * @Description Checks the JWT token is in the header or not
 */
export const authRequest = async (req: Request, res: Response, next: NextFunction) => {
    // Extract the token from the authorization header and remove the "Bearer" prefix
    const authHeader = req.headers["authorization"]?.replace("Bearer", "").trim();
    // Check if the token is missing or doesn't match the expected token
    if (!authHeader || authHeader !== token) {
        // If the token is missing or invalid, return an error response with the appropriate message and HTTP status code
        return ErrorResponse(res, {message: authHeader ? "Invalid Token" : "Missing Token"}, HttpStatusCode.FORBIDDEN);
    }
    // If the token is valid, call the next middleware function
    next();
}