import { StatCard } from "@/components/admin/stat-card";
import { RealTimeView } from "@/components/admin/real-time-view";
import { userBookings, parkingLocations } from "@/lib/data";
import { DollarSign, Car, Percent } from "lucide-react";

export default function AdminPage() {
  const activeBookings = userBookings.filter(
    (b) => b.status === "active"
  ).length;
  const totalRevenue = userBookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.cost, 0);

  const totalSlots = parkingLocations.reduce(
    (sum, loc) => sum + loc.totalSlots,
    0
  );
  const totalOccupied = parkingLocations.reduce(
    (sum, loc) => sum + loc.occupiedSlots,
    0
  );
  const occupancyRate = totalSlots > 0 ? (totalOccupied / totalSlots) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
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
        <RealTimeView />
      </div>
    </div>
  );
}
