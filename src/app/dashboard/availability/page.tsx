"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { ParkingLocation, Booking } from "@/lib/data";

export default function AvailabilityPage() {
  const firestore = useFirestore();
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const locationsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "parking_locations")) : null),
    [firestore]
  );
  const { data: parkingLocations, isLoading: locationsLoading } = useCollection<ParkingLocation>(locationsQuery);

  useEffect(() => {
    if (parkingLocations && parkingLocations.length > 0 && !selectedLocationId) {
      setSelectedLocationId(parkingLocations[0].id);
    }
  }, [parkingLocations, selectedLocationId]);

  const selectedLocation = parkingLocations?.find(
    (loc) => loc.id === selectedLocationId
  );

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !selectedLocationId) return null;
    return query(collection(firestore, "bookings"), where("locationId", "==", selectedLocationId));
  }, [firestore, selectedLocationId]);

  const { data: locationBookings, isLoading: bookingsLoading } = useCollection<Booking>(bookingsQuery);

  const getAvailabilityForDate = (day: Date) => {
    if (!selectedLocation) return { available: 0, total: 0 };
    
    const dayString = day.toDateString();
    const bookingsForDay = locationBookings?.filter(
      (b) => {
        const entry = new Date(b.entryDateTime).toDateString();
        const exit = new Date(b.exitDateTime).toDateString();
        return entry === dayString || exit === dayString;
      }
    ) || [];
    
    const availableSlots = selectedLocation.totalSlots - bookingsForDay.length;
    return {
      available: Math.max(0, availableSlots),
      total: selectedLocation.totalSlots,
    };
  };

  const DayWithAvailability = ({ date }: { date: Date }) => {
    const { available, total } = getAvailabilityForDate(date);
    let availabilityColor = "text-green-600";
    
    if (!selectedLocation) return <div>{date.getDate()}</div>;

    if (available <= 0) {
      availabilityColor = "text-red-600";
    } else if (available < total / 4) {
      availabilityColor = "text-orange-500";
    }

    return (
      <div className="relative flex flex-col items-center justify-center">
        <span className="text-sm">{date.getDate()}</span>
        <div
          className={`text-[10px] font-bold ${availabilityColor}`}
        >
          {available}
        </div>
      </div>
    );
  };

  const availability = getAvailabilityForDate(date || new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Availability</CardTitle>
        <CardDescription>
          Select a location and a date to see available slots in Chamarajanagara.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {locationsLoading ? (
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          ) : (
            <Select
              onValueChange={setSelectedLocationId}
              value={selectedLocationId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {parkingLocations?.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="rounded-md border flex justify-center p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              components={{
                DayContent: (props) => <DayWithAvailability date={props.date} />,
              }}
            />
          </div>
        </div>
        {selectedLocation && date && (
          <div className="flex items-center justify-center">
            <Card className="w-full">
              <CardHeader className="items-center text-center">
                <CardTitle>
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
                <CardDescription>{selectedLocation.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">{availability.available}</span>
                  <span className="text-xl text-muted-foreground">
                    / {availability.total} slots available
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-accent rounded-full h-4 transition-all duration-500"
                    style={{ width: `${availability.total > 0 ? (availability.available / availability.total) * 100 : 0}%` }}
                  />
                </div>
                {bookingsLoading && (
                  <p className="text-xs text-muted-foreground animate-pulse">Refreshing data...</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
