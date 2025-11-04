"use client";
import React, { useState } from "react";
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
import { parkingLocations, userBookings } from "@/lib/data";

export default function AvailabilityPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >(String(parkingLocations[0].id));
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedLocation = parkingLocations.find(
    (loc) => loc.id === Number(selectedLocationId)
  );

  const getAvailabilityForDate = (day: Date) => {
    if (!selectedLocation) return { available: 0, total: 0 };
    const bookingsForDay = userBookings.filter(
      (b) =>
        b.locationId === selectedLocation.id &&
        new Date(b.entryTime).toDateString() === day.toDateString()
    );
    const availableSlots =
      selectedLocation.totalSlots - bookingsForDay.length;
    return {
      available: availableSlots,
      total: selectedLocation.totalSlots,
    };
  };

  const DayWithAvailability = ({ date }: { date: Date }) => {
    const { available } = getAvailabilityForDate(date);
    let availabilityColor = "text-green-600";
    if (available <= 0) {
      availabilityColor = "text-red-600";
    } else if (available < (selectedLocation?.totalSlots ?? 0) / 4) {
      availabilityColor = "text-orange-500";
    }

    return (
      <div className="relative">
        {date.getDate()}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-bold ${availabilityColor}`}
        >
          {available}
        </div>
      </div>
    );
  };

  const { available, total } = getAvailabilityForDate(date || new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Availability</CardTitle>
        <CardDescription>
          Select a location and a date to see available slots.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Select
            onValueChange={setSelectedLocationId}
            defaultValue={selectedLocationId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {parkingLocations.map((loc) => (
                <SelectItem key={loc.id} value={String(loc.id)}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="rounded-md border flex justify-center">
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
                  <span className="text-6xl font-bold">{available}</span>
                  <span className="text-xl text-muted-foreground">
                    / {total} slots available
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-accent rounded-full h-4"
                    style={{ width: `${(available / total) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
