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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import type { Booking } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { collection, query, where } from "firebase/firestore";

function BookingsTable({ bookings, isLoading }: { bookings: Booking[] | null, isLoading: boolean }) {
  if (isLoading) {
    return (
       <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm h-[200px]">
        <p className="text-muted-foreground">Loading bookings...</p>
      </div>
    )
  }
  
  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm h-[200px]">
        <p className="text-muted-foreground">No bookings found.</p>
      </div>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location ID</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.locationId}
              </TableCell>
              <TableCell>
                {new Date(booking.entryTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(booking.exitTime).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                ${booking.cost.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {booking.status === "upcoming" && (
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default function BookingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/bookings`));
  }, [firestore, user]);

  const { data: userBookings, isLoading: areBookingsLoading } = useCollection<Booking>(bookingsQuery);

  const bookingsByStatus = (status: Booking["status"]) =>
    userBookings?.filter((b) => b.status === status) || [];

  const upcomingBookings = bookingsByStatus("upcoming");
  const activeBookings = bookingsByStatus("active");
  const completedBookings = bookingsByStatus("completed");
  const cancelledBookings = bookingsByStatus("cancelled");

  return (
    <Tabs defaultValue="upcoming">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="upcoming">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>
              Your scheduled parking reservations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsTable bookings={upcomingBookings} isLoading={isUserLoading || areBookingsLoading} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="active">
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
            <CardDescription>
              Your parking sessions that are currently in progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsTable bookings={activeBookings} isLoading={isUserLoading || areBookingsLoading} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="completed">
        <Card>
          <CardHeader>
            <CardTitle>Completed Bookings</CardTitle>
            <CardDescription>Your past parking history.</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsTable bookings={completedBookings} isLoading={isUserLoading || areBookingsLoading} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cancelled">
        <Card>
          <CardHeader>
            <CardTitle>Cancelled Bookings</CardTitle>
            <CardDescription>
              Your cancelled parking reservations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsTable bookings={cancelledBookings} isLoading={isUserLoading || areBookingsLoading} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
