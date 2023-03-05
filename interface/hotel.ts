import {Room} from "./room";


export interface Hotel {
    HotelId: number;
    HotelName: string;
    Description: string;
    Category: string;
    ParkingIncluded: boolean;
    Rating: number;
    Rooms: Room[];
}