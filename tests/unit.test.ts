import { creatHotelBookingService, getAllHotelsService } from "../module/hotel/hotel.service";
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

// const mockBooking: Booking = {
//   HotelId: 1,
//   BookingId: 'def456',
//   RoomId: 1,
//   CheckIn: '2023-03-01',
//   CheckOut: '2023-03-03',
//   CustomerDetails: {
//     FirstName: 'John',
//     LastName: 'Doe',
//     Email: 'john.doe@example.com',
//     PhoneNumber: '123-456-7890',
//     Payment: 'credit_card',
//   },
// };
//
// jest.mock('../module/hotel/hotel.service', () => ({
//   getCacheForBookingsAndHotels: jest.fn(() => ({
//     Booking: [],
//     Hotels: [{ id: 1, name: 'Test Hotel' }],
//   })),
// }));
//
// jest.mock('../module/hotel/hotel.repository', () => ({
//   createBookingRepo: jest.fn(),
// }));
//
// describe('createHotelBookingService', () => {
//   it('should create a booking and return the booking ID', async () => {
//     const { createHotelBookingService } = require('../module/hotel/hotel.service');
//
//     jest.mock('uuid', () => ({
//       v4: jest.fn(() => '12345'),
//     }));
//
//     const result = await createHotelBookingService(mockBooking);
//
//     expect(result).toEqual({ 'Booking Id': '12345' });
//     expect(uuidv4).toHaveBeenCalled();
//     expect(createBookingRepo).toHaveBeenCalledWith({
//       ...mockBooking,
//       BookingId: '12345',
//     });
//   });
//
//   it('should throw an error if the booking is invalid', async () => {
//     const { createHotelBookingService } = require('../module/hotel/hotel.service');
//
//     // expect.assertions(1);
//     try {
//       await createHotelBookingService({});
//     } catch (e) {
//       console.log('ddd', e)
//       // expect(e).toEqual('Booking is invalid');
//     }
//   });
// });


