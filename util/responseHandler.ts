import { Response } from 'express';

export const ErrorResponse = (res: Response, error: any, code = 400): Response => {
    return res.status(code).json({ success: false, data: { errorMessage: error.message } });
};

export const SuccessResponse = (res: Response, data: any, message: string, code = 200): Response => {
    return res.status(code).json({ success: true, data, message });
};
