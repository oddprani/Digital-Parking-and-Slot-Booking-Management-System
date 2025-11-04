export type User = {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
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
    locationId: string;
    entryTime: string;
    exitTime: string;
    totalPrice: number;
    status: "upcoming" | "active" | "completed" | "cancelled";
}

export const users: User[] = [
    {
        id: "user1",
        name: "John Doe",
        email: "user@example.com",
        role: "user",
    },
    {
        id: "admin1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin"
    }
];

export const parkingLocations: ParkingLocation[] = [
    {
        id: "loc1",
        name: "Downtown Central Garage",
        address: "123 Main St, Anytown, USA",
        totalSlots: 250,
        occupiedSlots: 175,
        pricePerHour: 3.50,
    },
    {
        id: "loc2",
        name: "Uptown Plaza Lot",
        address: "456 Oak Ave, Anytown, USA",
        totalSlots: 120,
        occupiedSlots: 30,
        pricePerHour: 2.75,
    },
    {
        id: "loc3",
        name: "Airport Economy Park",
        address: "789 Airport Rd, Anytown, USA",
        totalSlots: 500,
        occupiedSlots: 450,
        pricePerHour: 1.50,
    },
    {
        id: "loc4",
        name: "Riverfront Parking Deck",
        address: "101 River Dr, Anytown, USA",
        totalSlots: 80,
        occupiedSlots: 75,
        pricePerHour: 4.00,
    }
]

const now = new Date();
export const userBookings: Booking[] = [
    {
        id: "booking1",
        userId: "user1",
        locationId: "loc1",
        entryTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000)).toISOString(),
        totalPrice: 10.50,
        status: "upcoming"
    },
    {
        id: "booking2",
        userId: "user1",
        locationId: "loc2",
        entryTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
        totalPrice: 8.25,
        status: "active"
    },
    {
        id: "booking3",
        userId: "user1",
        locationId: "loc3",
        entryTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000)).toISOString(),
        totalPrice: 6.00,
        status: "completed"
    },
    {
        id: "booking4",
        userId: "user1",
        locationId: "loc4",
        entryTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000)).toISOString(),
        totalPrice: 8.00,
        status: "completed"
    },
    {
        id: "booking5",
        userId: "user1",
        locationId: "loc1",
        entryTime: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() - (20 * 24 * 60 * 60 * 1000) + (1 * 60 * 60 * 1000)).toISOString(),
        totalPrice: 3.50,
        status: "cancelled"
    },
     {
        id: "booking6",
        userId: "admin1",
        locationId: "loc2",
        entryTime: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        totalPrice: 8.25,
        status: "active"
    },
]
