"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { ParkingLocation } from "@/lib/data";

export function RealTimeView({ locations }: { locations: ParkingLocation[] | null}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Location View</CardTitle>
        <CardDescription>
          Live occupancy status across all parking locations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead className="text-center">Occupied</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="w-[200px]">Occupancy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations?.map((location) => {
              const available = location.totalSlots - location.occupiedSlots;
              const occupancy = (location.occupiedSlots / location.totalSlots) * 100;
              return (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell className="text-center">{location.occupiedSlots}</TableCell>
                  <TableCell className="text-center text-green-600 font-medium">{available}</TableCell>
                  <TableCell className="text-center">{location.totalSlots}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={occupancy} className="h-2" />
                      <span className="text-xs text-muted-foreground">{occupancy.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
