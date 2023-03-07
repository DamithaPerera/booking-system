import { Request, Response } from 'express';
import {
  creatHotelBookingService,
  getAllHotelsService,
  updateHotelBookingService
} from "../module/hotel/hotel.service";
import {
  creatHotelBookingController,
  getAllHotelsController,
  updateHotelBookingController
} from "../module/hotel/hotel.controller";


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


jest.mock('../module/hotel/hotel.service');

describe('creatHotelBookingController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        hotelName: 'Hotel A',
        checkIn: '2023-03-07',
        checkOut: '2023-03-09',
        guestName: 'John Doe',
        guestEmail: 'johndoe@example.com',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should create hotel booking and return success response', async () => {
    const expectedData = { bookingId: 'abc123', hotelName: 'Hotel A', checkIn: '2023-03-07', checkOut: '2023-03-09' };
    (creatHotelBookingService as jest.Mock).mockResolvedValue(expectedData);

    await creatHotelBookingController(<Request>req, <Response>res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Booking Created Successfully',
      data: expectedData,
    });
  });

  it('should return error response on failure', async () => {
    const errorMessage = 'Invalid guest email';
    (creatHotelBookingService as jest.Mock).mockRejectedValue(errorMessage);

    await creatHotelBookingController(<Request>req, <Response>res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {
        'errorMessage': errorMessage
      },
    });
  });
});




jest.mock('../module/hotel/hotel.service');

describe('updateHotelBookingController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {
        hotelId: '1',
        roomId: '2',
        bookingId: 'abc123',
      },
      body: {
        checkIn: '2023-03-07',
        checkOut: '2023-03-09',
        guestName: 'John Doe',
        guestEmail: 'johndoe@example.com',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should update hotel booking and return success response', async () => {
    const expectedData = { bookingId: 'abc123', hotelName: 'Hotel A', checkIn: '2023-03-07', checkOut: '2023-03-09' };
    (updateHotelBookingService as jest.Mock).mockResolvedValue(expectedData);

    await updateHotelBookingController(<Request>req, <Response>res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Booking Updated Successfully',
      data: expectedData,
    });
  });

  it('should return error response on failure', async () => {
    const errorMessage = 'Invalid guest email';
    (updateHotelBookingService as jest.Mock).mockRejectedValue(errorMessage);

    await updateHotelBookingController(<Request>req, <Response>res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {
        'errorMessage': errorMessage
      },
    });
  });
});

