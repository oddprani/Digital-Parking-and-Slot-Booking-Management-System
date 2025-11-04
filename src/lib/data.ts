export type User = {
    id: number;
    name: string;
    email: string;
    password; // In a real app, this would be a hash
    role: "user" | "admin";
}

export type ParkingLocation = {
    id: number;
    name: string;
    address: string;
    totalSlots: number;
    occupiedSlots: number;
    pricePerHour: number;
}

export type Booking = {
    id: number;
    userId: number;
    locationId: number;
    entryTime: string;
    exitTime: string;
    cost: number;
    status: "upcoming" | "active" | "completed" | "cancelled";
}

export const users: User[] = [
    {
        id: 1,
        name: "John Doe",
        email: "user@example.com",
        password: "password123",
        role: "user",
    },
    {
        id: 2,
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin"
    }
];

export const parkingLocations: ParkingLocation[] = [
    {
        id: 1,
        name: "Downtown Central Garage",
        address: "123 Main St, Anytown, USA",
        totalSlots: 250,
        occupiedSlots: 175,
        pricePerHour: 3.50,
    },
    {
        id: 2,
        name: "Uptown Plaza Lot",
        address: "456 Oak Ave, Anytown, USA",
        totalSlots: 120,
        occupiedSlots: 30,
        pricePerHour: 2.75,
    },
    {
        id: 3,
        name: "Airport Economy Park",
        address: "789 Airport Rd, Anytown, USA",
        totalSlots: 500,
        occupiedSlots: 450,
        pricePerHour: 1.50,
    },
    {
        id: 4,
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
        id: 1,
        userId: 1,
        locationId: 1,
        entryTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000)).toISOString(),
        cost: 10.50,
        status: "upcoming"
    },
    {
        id: 2,
        userId: 1,
        locationId: 2,
        entryTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
        cost: 8.25,
        status: "active"
    },
    {
        id: 3,
        userId: 1,
        locationId: 3,
        entryTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000)).toISOString(),
        cost: 6.00,
        status: "completed"
    },
    {
        id: 4,
        userId: 1,
        locationId: 4,
        entryTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000)).toISOString(),
        cost: 8.00,
        status: "completed"
    },
    {
        id: 5,
        userId: 1,
        locationId: 1,
        entryTime: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() - (20 * 24 * 60 * 60 * 1000) + (1 * 60 * 60 * 1000)).toISOString(),
        cost: 3.50,
        status: "cancelled"
    },
     {
        id: 6,
        userId: 2,
        locationId: 2,
        entryTime: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        cost: 8.25,
        status: "active"
    },
]
