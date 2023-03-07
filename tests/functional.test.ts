import { Request, Response } from 'express';
import { getAllHotelsService } from "../module/hotel/hotel.service";
import { getAllHotelsController } from "../module/hotel/hotel.controller";


jest.mock('../module/hotel/hotel.service');

describe('getAllHotelsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      query: {
        checkIn: '2023-05-07',
        checkOut: '2023-06-09',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should return hotel details on success', async () => {
    const expectedData = [{ name: 'Hotel A', price: 100 }, { name: 'Hotel B', price: 200 }];
    (getAllHotelsService as jest.Mock).mockResolvedValue(expectedData);

    await getAllHotelsController(<Request>req, <Response>res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Hotel Details',
      data: expectedData,
    });
  });

  it('should return error response on failure', async () => {
    const errorMessage = 'Invalid date range';
    (getAllHotelsService as jest.Mock).mockRejectedValue(errorMessage);

    await getAllHotelsController(<Request>req, <Response>res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {
        'errorMessage': errorMessage
      },
    });
  });
});
