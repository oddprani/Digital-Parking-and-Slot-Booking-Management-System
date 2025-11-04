"use client";
import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationCard } from "@/components/dashboard/location-card";
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { ParkingLocation } from "@/lib/data";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const seedData: Omit<ParkingLocation, 'id'>[] = [
    {
        name: "Downtown Central Garage",
        address: "123 Main St, Anytown, USA",
        totalSlots: 250,
        occupiedSlots: 175,
        pricePerHour: 3.50,
    },
    {
        name: "Uptown Plaza Lot",
        address: "456 Oak Ave, Anytown, USA",
        totalSlots: 120,
        occupiedSlots: 30,
        pricePerHour: 2.75,
    },
    {
        name: "Airport Economy Park",
        address: "789 Airport Rd, Anytown, USA",
        totalSlots: 500,
        occupiedSlots: 450,
        pricePerHour: 1.50,
    },
    {
        name: "Riverfront Parking Deck",
        address: "101 River Dr, Anytown, USA",
        totalSlots: 80,
        occupiedSlots: 75,
        pricePerHour: 4.00,
    }
];

export default function Dashboard() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  const locationsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "parking_locations")) : null),
    [firestore]
  );
  const {
    data: parkingLocations,
    isLoading,
    error,
  } = useCollection<ParkingLocation>(locationsQuery);

  const handleSeedData = React.useCallback(async () => {
    if (!firestore || isSeeding) return;
    setIsSeeding(true);
    try {
      const locationsColRef = collection(firestore, 'parking_locations');
      for (const locationData of seedData) {
        addDocumentNonBlocking(locationsColRef, locationData);
      }
      toast({
        title: 'Seeding Complete',
        description: `Your dashboard is ready with initial parking locations.`,
      });
    } catch (e: any) {
       toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: e.message || 'Could not seed data.',
      });
    } finally {
        setIsSeeding(false);
    }
  }, [firestore, toast, isSeeding]);

  useEffect(() => {
    if (!isLoading && parkingLocations?.length === 0 && firestore) {
      handleSeedData();
    }
  }, [isLoading, parkingLocations, firestore, handleSeedData]);


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
          {isLoading && !parkingLocations && <p>Loading locations...</p>}
          {error && <p className="text-destructive">Error loading locations: {error.message}</p>}
          
          {!isLoading && !error && parkingLocations && parkingLocations.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {parkingLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          )}

          {!isLoading && parkingLocations?.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm h-[200px] mt-4">
                <div className='text-center'>
                    <p className="text-muted-foreground mb-2">No parking locations found.</p>
                    <p className="text-sm text-muted-foreground">Automatically seeding initial data...</p>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
