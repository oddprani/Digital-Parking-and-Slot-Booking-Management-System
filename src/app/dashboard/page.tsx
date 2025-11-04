"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationCard } from "@/components/dashboard/location-card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { ParkingLocation } from "@/lib/data";

export default function Dashboard() {
  const firestore = useFirestore();
  const locationsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "parking_locations")) : null),
    [firestore]
  );
  const {
    data: parkingLocations,
    isLoading,
    error,
  } = useCollection<ParkingLocation>(locationsQuery);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Book a Parking Spot</CardTitle>
          <CardDescription>
            Select a location to view details and book your spot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading locations...</p>}
          {error && <p className="text-destructive">Error loading locations: {error.message}</p>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {parkingLocations?.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
