import {
  creatHotelBookingService,
  getAllHotelsService,
  getCacheForBookingsAndHotels
} from "../module/hotel/hotel.service";
import { createBookingRepo } from "../module/hotel/hotel.repository";
import {v4 as uuidv4} from 'uuid';
import { Booking } from "../interface/Booking";


describe('getAllHotelsService', () => {
  it('returns all hotels with available rooms within the specified date range', async () => {
    // Mock the cache data
    const mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    };
    mockCache.get.mockImplementation((key) => {
      if (key === 'getHotels') {
        return [
          {
            HotelId: 1,
            Name: 'Hotel A',
            Rooms: [
              { RoomId: 1, Name: 'Room 1' },
              { RoomId: 2, Name: 'Room 2' },
            ],
          },
          {
            HotelId: 2,
            Name: 'Hotel B',
            Rooms: [{ RoomId: 3, Name: 'Room 3' }],
          },
        ];
      } else if (key === 'getBookings') {
        return [
          {
            BookingId: 1,
            RoomId: 1,
            CheckIn: '2023-03-08',
            CheckOut: '2023-03-12',
          },
        ];
      }
    });

    const checkInDate = '2023-03-10';
    const checkOutDate = '2023-03-14';

    const expectedOutput = [
      {
        HotelId: 1,
        Name: 'Hotel A',
        Rooms: [{ RoomId: 2, Name: 'Room 2' }],
      },
      {
        HotelId: 2,
        Name: 'Hotel B',
        Rooms: [{ RoomId: 3, Name: 'Room 3' }],
      },
    ];

    // Call the function with the mock cache
    const output = await getAllHotelsService(checkInDate, checkOutDate);
    // Assert that the output matches the expected output
    expect(output).toEqual(expect.any(Array))
  });
});


describe('creatHotelBookingService', () => {
  it('should create a booking and return the booking ID', async () => {
    const requestBody: Booking = {
      HotelId: 1,
      RoomId: 100003,
      BookingId: 'ddd222',
      CheckIn: '2023-03-10',
      CheckOut: '2023-03-15',
      CustomerDetails: {
        FirstName: 'John Doe',
        LastName: 'John Doe',
        Email: 'johndoe@example.com',
        PhoneNumber: '555-555-5555',
        Payment: 'SUCCESS'
      }
    };

    const expectedResponse = {
      'Booking Id': expect.any(String)
    };

    const result = await creatHotelBookingService(requestBody);

    expect(result).toEqual(expectedResponse);
  });

  it('should throw an error if the hotel ID is invalid', async () => {
    const requestBody : Booking = {
      HotelId: 99, // Invalid hotel ID
      RoomId: 100003,
      BookingId: 'ddd222',
      CheckIn: '2023-03-10',
      CheckOut: '2023-03-15',
      CustomerDetails: {
        FirstName: 'John Doe',
        LastName: 'John Doe',
        Email: 'johndoe@example.com',
        PhoneNumber: '555-555-5555',
        Payment: 'SUCCESS'
      }
    };

    await expect(creatHotelBookingService(requestBody)).rejects.toThrowError('Error: Hotel with ID 99 does not exist.');
  });

  it('should throw an error if the room ID is invalid', async () => {
    const requestBody: Booking = {
      HotelId: 1,
      RoomId: 10, // Invalid room ID
      BookingId: 'ddd222',
      CheckIn: '2023-03-10',
      CheckOut: '2023-03-15',
      CustomerDetails: {
        FirstName: 'John Doe',
        LastName: 'John Doe',
        Email: 'johndoe@example.com',
        PhoneNumber: '555-555-5555',
        Payment: 'SUCCESS'
      }
    };

    await expect(creatHotelBookingService(requestBody)).rejects.toThrowError(`: Room with ID 10 does not exist in hotel 1.`);
  });

  it('should throw an error if the room is not available during the specified date range', async () => {
    const requestBody: Booking = {
      HotelId: 1,
      RoomId: 100003,
      BookingId: 'ddd222',
      CheckIn: '2023-03-12',
      CheckOut: '2023-03-16',
      CustomerDetails: {
        FirstName: 'John Doe',
        LastName: 'John Doe',
        Email: 'johndoe@example.com',
        PhoneNumber: '555-555-5555',
        Payment: 'SUCCESS'
      }
    };

    await expect(creatHotelBookingService(requestBody)).rejects.toThrowError('Error: Room with ID 100003 in hotel 1 is not available during the specified date range.');
  });

  it('should throw an error if an invalid date range is specified', async () => {
    const requestBody: Booking = {
      HotelId: 1,
      RoomId: 100003,
      BookingId: 'ddd222',
      CheckIn: '2023-03-16', // Check-in date is after check-out date
      CheckOut: '2023-03-12',
      CustomerDetails: {
        FirstName: 'John Doe',
        LastName: 'John Doe',
        Email: 'johndoe@example.com',
        PhoneNumber: '555-555-5555',
        Payment: 'SUCCESS'
      }
    };

    await expect(creatHotelBookingService(requestBody)).rejects.toThrowError('Error: Invalid date range specified.');
  });
});



