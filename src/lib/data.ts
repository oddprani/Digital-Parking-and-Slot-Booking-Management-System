
export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type ParkingLocation = {
    id: string;
    name: string;
    address: string;
    totalSlots: number;
    occupiedSlots: number;
    pricePerHour: number;
}

export type Booking = {
    id: string;
    userId: string;
    userName: string;
    carNumber: string;
    locationId: string;
    entryDateTime: string;
    exitDateTime: string;
    bookingDateTime: string;
    totalPrice: number;
    status: "upcoming" | "active" | "completed" | "cancelled";
}
