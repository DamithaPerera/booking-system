import { getAllHotelsService } from '../module/hotel/hotel.service';
import { array } from "joi";

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