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
import React, { useEffect } from 'react';

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
      totalSlots: 20,
      pricePerHour: 30,
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
                <Input placeholder="e.g., KSRTC Bus Stand Parking" {...field} />
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
                <Input placeholder="e.g., B. Rachaiah Double Road" {...field} />
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
                <FormLabel>Price Per Hour (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...field} />
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
        name: "KSRTC Bus Stand Parking",
        address: "B. Rachaiah Double Road, Chamarajanagara, Karnataka",
        totalSlots: 150,
        occupiedSlots: 90,
        pricePerHour: 20,
    },
    {
        name: "JSS College Parking Lot",
        address: "Srinivasa Nagar, Chamarajanagara, Karnataka",
        totalSlots: 80,
        occupiedSlots: 20,
        pricePerHour: 15,
    },
    {
        name: "District Hospital Parking",
        address: "Near Court Road, Chamarajanagara, Karnataka",
        totalSlots: 60,
        occupiedSlots: 50,
        pricePerHour: 25,
    },
    {
        name: "Big Bazaar Shopping Lot",
        address: "Divanara Street, Chamarajanagara, Karnataka",
        totalSlots: 100,
        occupiedSlots: 85,
        pricePerHour: 30,
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
  }, [firestore, toast, isSeeding]);

  useEffect(() => {
    if (!isLoading && parkingLocations?.length === 0 && firestore) {
      handleSeedData();
    }
  }, [isLoading, parkingLocations, firestore, handleSeedData]);

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
        {isLoading && !parkingLocations && <p>Loading locations...</p>}
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
                  ₹{location.pricePerHour.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
  );
}
