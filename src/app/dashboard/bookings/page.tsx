
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
import { collection, query } from "firebase/firestore";
import { format } from "date-fns";
import { Ticket } from "lucide-react";

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
            <TableHead>Location</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {(booking as any).locationName || booking.locationId}
              </TableCell>
              <TableCell className="uppercase font-mono text-xs">
                {booking.carNumber}
              </TableCell>
              <TableCell>
                {booking.userName}
              </TableCell>
              <TableCell>
                {format(new Date(booking.entryDateTime), "MMM d, h:mm a")}
              </TableCell>
              <TableCell>
                {format(new Date(booking.exitDateTime), "MMM d, h:mm a")}
              </TableCell>
              <TableCell className="text-right font-bold text-primary">
                ₹{(booking.totalPrice || 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Ticket className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">View</span>
                </Button>
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
        <p className="text-muted-foreground">Manage your parking history and upcoming reservations.</p>
      </div>

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
    </div>
  );
}
