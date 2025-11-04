import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parkingLocations } from "@/lib/data";
import { LocationCard } from "@/components/dashboard/location-card";

export default function Dashboard() {
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {parkingLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
