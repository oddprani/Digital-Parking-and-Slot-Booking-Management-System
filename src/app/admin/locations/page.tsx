'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, doc } from 'firebase/firestore';
import type { ParkingLocation } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import React from 'react';

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  totalSlots: z.coerce.number().int().min(1, 'Total slots must be at least 1'),
  pricePerHour: z.coerce
    .number()
    .min(0, 'Price per hour must be a positive number'),
});

function LocationForm({
  onFinished,
}: {
  onFinished: () => void;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      address: '',
      totalSlots: 10,
      pricePerHour: 2.5,
    },
  });

  async function onSubmit(values: z.infer<typeof locationSchema>) {
    if (!firestore) return;

    const locationsColRef = collection(firestore, 'parking_locations');
    addDocumentNonBlocking(locationsColRef, {
      ...values,
      occupiedSlots: 0,
    });

    toast({
      title: 'Location Created',
      description: `${values.name} has been added.`,
    });
    form.reset();
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Downtown Central Garage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalSlots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Slots</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricePerHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Per Hour ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating...' : 'Create Location'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

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

export default function AdminLocationsPage() {
  const firestore = useFirestore();
  const [isSeeding, setIsSeeding] = React.useState(false);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const locationsQuery = useMemoFirebase(
    () =>
      firestore ? query(collection(firestore, 'parking_locations')) : null,
    [firestore]
  );
  const {
    data: parkingLocations,
    isLoading,
    error,
  } = useCollection<ParkingLocation>(locationsQuery);

  const handleSeedData = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
      const locationsColRef = collection(firestore, 'parking_locations');
      for (const locationData of seedData) {
        // Use a consistent ID generation scheme if needed, or let Firestore auto-generate
        addDocumentNonBlocking(locationsColRef, locationData);
      }
      toast({
        title: 'Seeding Complete',
        description: `${seedData.length} parking locations have been added.`,
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
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Parking Locations</CardTitle>
          <CardDescription>
            Manage all parking locations in the system.
          </CardDescription>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleSeedData} variant="outline" disabled={isSeeding || (parkingLocations && parkingLocations.length > 0)}>
                {isSeeding ? "Seeding..." : "Seed Dummy Data"}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                <Button>Add Location</Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Parking Location</DialogTitle>
                </DialogHeader>
                <LocationForm onFinished={() => setIsDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading locations...</p>}
        {error && (
          <p className="text-destructive">
            Error loading locations: {error.message}
          </p>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-center">Total Slots</TableHead>
              <TableHead className="text-center">Occupied</TableHead>
              <TableHead className="text-right">Price/Hour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parkingLocations?.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell className="text-center">
                  {location.totalSlots}
                </TableCell>
                <TableCell className="text-center">
                  {location.occupiedSlots}
                </TableCell>
                <TableCell className="text-right">
                  ${location.pricePerHour.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && parkingLocations?.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm h-[200px] mt-4">
                <div className='text-center'>
                    <p className="text-muted-foreground mb-2">No parking locations found.</p>
                    <Button onClick={handleSeedData} variant="default" disabled={isSeeding}>
                        {isSeeding ? "Seeding..." : "Seed Dummy Data"}
                    </Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
