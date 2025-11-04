"use client";
import { StatCard } from "@/components/admin/stat-card";
import { RealTimeView } from "@/components/admin/real-time-view";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Booking, ParkingLocation } from "@/lib/data";
import { DollarSign, Car, Percent } from "lucide-react";

export default function AdminPage() {
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "bookings")) : null),
    [firestore]
  );
  const { data: allBookings, isLoading: bookingsLoading } = useCollection<Booking>(bookingsQuery);
  
  const locationsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "parking_locations")) : null),
    [firestore]
  );
  const { data: parkingLocations, isLoading: locationsLoading } = useCollection<ParkingLocation>(locationsQuery);

  const activeBookings = allBookings?.filter(
    (b) => b.status === "active"
  ).length ?? 0;

  const totalRevenue = allBookings
    ?.filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalPrice, 0) ?? 0;

  const totalSlots = parkingLocations?.reduce(
    (sum, loc) => sum + loc.totalSlots,
    0
  ) ?? 0;

  const totalOccupied = parkingLocations?.reduce(
    (sum, loc) => sum + loc.occupiedSlots,
    0
  ) ?? 0;
  
  const occupancyRate = totalSlots > 0 ? (totalOccupied / totalSlots) * 100 : 0;
  
  const isLoading = bookingsLoading || locationsLoading;

  return (
    <div className="flex flex-col gap-8">
       {isLoading ? (
        <p>Loading admin data...</p>
      ) : (
      <>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <StatCard
            title="Total Revenue (Completed)"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description="Total revenue from all completed bookings."
          />
          <StatCard
            title="Active Bookings"
            value={activeBookings.toString()}
            icon={<Car className="h-4 w-4 text-muted-foreground" />}
            description="Number of vehicles currently parked."
          />
          <StatCard
            title="Overall Occupancy"
            value={`${occupancyRate.toFixed(1)}%`}
            icon={<Percent className="h-4 w-4 text-muted-foreground" />}
            description="Percentage of all slots currently occupied."
          />
        </div>
        <div>
          <RealTimeView locations={parkingLocations} />
        </div>
      </>
      )}
    </div>
  );
}
