import { Response } from "express";

// This function is used to send error responses back to the client with the specified error message and status code.
// It takes in the response object, error object, and status code as parameters, and returns the updated response object.
export const ErrorResponse = (res: Response, error: any, code = 400): Response => {
    return res.status(code).json({ success: false, data: { errorMessage: error.message } });
};

// This function is used to send success responses back to the client with the specified data, message, and status code.
// It takes in the response object, data object, message string, and status code as parameters, and returns the updated response object.
export const SuccessResponse = (res: Response, data: any, message: string, code = 200): Response => {
    return res.status(code).json({ success: true, data, message });
};
