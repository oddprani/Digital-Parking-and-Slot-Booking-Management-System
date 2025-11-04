import Image from "next/image";
import { MapPin, Car, DollarSign, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParkingLocation } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/dashboard/booking-form";

export function LocationCard({ location }: { location: ParkingLocation }) {
  const locationImage = PlaceHolderImages.find(
    (img) => img.id === `loc-${location.id}`
  );
  const availableSlots = location.totalSlots - location.occupiedSlots;
  const availabilityPercentage = (availableSlots / location.totalSlots) * 100;

  let availabilityBadge: "default" | "destructive" | "secondary" = "default";
  if (availabilityPercentage < 10) {
    availabilityBadge = "destructive";
  } else if (availabilityPercentage < 40) {
    availabilityBadge = "secondary";
  }

  return (
    <Dialog>
      <Card className="flex flex-col">
        <CardHeader className="p-0">
          <div className="relative">
            {locationImage && (
              <Image
                src={locationImage.imageUrl}
                alt={location.name}
                width={600}
                height={400}
                className="rounded-t-lg object-cover aspect-[3/2]"
                data-ai-hint={locationImage.imageHint}
              />
            )}
            <Badge
              variant={availabilityBadge}
              className="absolute top-2 right-2"
            >
              {availableSlots} Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg">{location.name}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location.address}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span>
                {location.occupiedSlots} / {location.totalSlots} slots
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-muted-foreground">₹</span>
              <span>{location.pricePerHour.toFixed(2)} / hour</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <DialogTrigger asChild>
            <Button className="w-full">Book Now</Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Book a Spot at {location.name}</DialogTitle>
          <DialogDescription>
            Select your entry and exit times to reserve your parking spot.
          </DialogDescription>
        </DialogHeader>
        <BookingForm location={location} />
      </DialogContent>
    </Dialog>
  );
}
