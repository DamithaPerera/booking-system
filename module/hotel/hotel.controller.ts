import {Request, Response} from 'express';
import {getAllHotelsService} from "./hotel.service";
import {ErrorResponse, SuccessResponse} from "../../util/responseHandler";




export const getAllHotelsController = async (req: Request, res: Response) => {
    try {
        const data = await getAllHotelsService()
        return SuccessResponse(res, data, 'Hotel Details', 200);
    } catch (error) {
        return ErrorResponse(res, { message: error }, 500);
    }

}



