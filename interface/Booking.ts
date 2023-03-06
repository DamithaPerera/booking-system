
export interface Booking {
    HotelId: number;
    RoomId: number;
    BookingId: string;
    CheckIn: string;
    CheckOut: string;
    CustomerDetails: {
        FirstName: string;
        LastName: string;
        Email: string;
        PhoneNumber: string;
        Payment: string;
    };
}