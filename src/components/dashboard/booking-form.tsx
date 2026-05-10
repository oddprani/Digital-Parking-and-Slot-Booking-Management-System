
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Car,
  Zap,
  Accessibility,
  Ticket,
  CheckCircle2,
  Printer,
} from "lucide-react";
import { collection } from "firebase/firestore";

import { ParkingLocation } from "@/lib/data";
import { bookingSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { Separator } from "@/components/ui/separator";

export function BookingForm({ location }: { location: ParkingLocation }) {
  const [cost, setCost] = useState(0);
  const [bookedDetails, setBookedDetails] = useState<any>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      userName: user?.displayName || "",
      carNumber: "",
      entryDate: new Date(),
      entryTime: format(new Date(), "HH:mm"),
      exitDate: new Date(),
      exitTime: format(
        new Date(new Date().getTime() + 60 * 60 * 1000),
        "HH:mm"
      ),
      parkingType: "standard",
    },
  });

  const calculateCost = () => {
    const values = form.getValues();
    const { entryDate, entryTime, exitDate, exitTime } = values;

    if (entryDate && entryTime && exitDate && exitTime) {
      try {
        const entryDateTime = new Date(
          `${format(entryDate, "yyyy-MM-dd")}T${entryTime}`
        );
        const exitDateTime = new Date(
          `${format(exitDate, "yyyy-MM-dd")}T${exitTime}`
        );

        if (exitDateTime > entryDateTime) {
          const durationHours =
            (exitDateTime.getTime() - entryDateTime.getTime()) /
            (1000 * 60 * 60);
          setCost(durationHours * location.pricePerHour);
        } else {
          setCost(0);
        }
      } catch (e) {
        setCost(0);
      }
    }
  };

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "You must be logged in to make a booking.",
      });
      return;
    }
    
    const entryDateTime = new Date(`${format(values.entryDate, "yyyy-MM-dd")}T${values.entryTime}`);
    const exitDateTime = new Date(`${format(values.exitDate, "yyyy-MM-dd")}T${values.exitTime}`);

    const newBooking = {
      userId: user.uid,
      userName: values.userName,
      carNumber: values.carNumber,
      locationId: location.id,
      locationName: location.name,
      parkingSlotId: "Slot-" + Math.floor(Math.random() * 100),
      entryDateTime: entryDateTime.toISOString(),
      exitDateTime: exitDateTime.toISOString(),
      bookingDateTime: new Date().toISOString(),
      status: "upcoming",
      totalPrice: cost,
      parkingType: values.parkingType,
    };
    
    const bookingsColRef = collection(firestore, `users/${user.uid}/bookings`);
    addDocumentNonBlocking(bookingsColRef, newBooking);

    setBookedDetails(newBooking);

    toast({
      title: "Booking Confirmed!",
      description: `Ticket generated for ${values.carNumber}`,
    });
  }

  if (bookedDetails) {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h3 className="text-2xl font-bold">Booking Successful!</h3>
          <p className="text-muted-foreground">Your parking ticket is ready.</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-card p-6 shadow-sm">
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background border-r-2 border-primary/30" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background border-l-2 border-primary/30" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Parking Ticket</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{bookedDetails.parkingSlotId}</span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold leading-none">{location.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{location.address}</p>
            </div>

            <Separator className="bg-primary/10" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground">Name</span>
                <p className="text-sm font-semibold">{bookedDetails.userName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground">Vehicle Number</span>
                <p className="text-sm font-semibold uppercase">{bookedDetails.carNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground">Entry</span>
                <p className="text-sm font-semibold">{format(new Date(bookedDetails.entryDateTime), "MMM d, h:mm a")}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground">Exit</span>
                <p className="text-sm font-semibold">{format(new Date(bookedDetails.exitDateTime), "MMM d, h:mm a")}</p>
              </div>
            </div>

            <div className="flex justify-between items-end pt-2">
               <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground">Type</span>
                <Badge variant="outline" className="capitalize">{bookedDetails.parkingType}</Badge>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-muted-foreground block">Total Paid</span>
                <span className="text-2xl font-black text-primary">₹{bookedDetails.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" /> Print Ticket
          </Button>
          <DialogClose asChild>
            <Button className="flex-1 sm:flex-none">Done</Button>
          </DialogClose>
        </DialogFooter>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. KA 10 M 1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Entry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        calculateCost();
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setDate(new Date().getDate() - 1))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="entryTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      calculateCost();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="exitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Exit Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        calculateCost();
                      }}
                      disabled={(date) =>
                        date < (form.getValues().entryDate || new Date())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exitTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exit Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      calculateCost();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="parkingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parking Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parking type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standard">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" /> Standard
                    </div>
                  </SelectItem>
                  <SelectItem value="ev">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" /> EV Charging
                    </div>
                  </SelectItem>
                  <SelectItem value="accessible">
                    <div className="flex items-center gap-2">
                      <Accessibility className="h-4 w-4" /> Accessible
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2 rounded-lg border bg-slate-50 p-4 dark:bg-slate-800/50">
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Cost</span>
            <span>₹{location.pricePerHour.toFixed(2)} / hour</span>
          </div>
          <div className="flex justify-between font-semibold text-xl text-primary">
            <span>Total</span>
            <span>₹{cost.toFixed(2)}</span>
          </div>
        </div>

        <DialogFooter>
           <DialogClose asChild>
            <Button id="close-dialog" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting ? "Generating Ticket..." : "Confirm & Book"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
            {children}
        </span>
    )
}
