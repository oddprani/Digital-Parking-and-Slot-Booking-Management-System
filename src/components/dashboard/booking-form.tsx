"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Car, Zap, Wheelchair } from "lucide-react";

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
import {
  DialogFooter
} from "@/components/ui/dialog";

export function BookingForm({ location }: { location: ParkingLocation }) {
  const [cost, setCost] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      entryDate: new Date(),
      entryTime: format(new Date(), "HH:mm"),
      exitDate: new Date(),
      exitTime: format(new Date(new Date().getTime() + 60 * 60 * 1000), "HH:mm"),
      parkingType: "standard",
    },
  });

  const calculateCost = () => {
    const values = form.getValues();
    const { entryDate, entryTime, exitDate, exitTime } = values;

    if (entryDate && entryTime && exitDate && exitTime) {
      const entryDateTime = new Date(`${format(entryDate, "yyyy-MM-dd")}T${entryTime}`);
      const exitDateTime = new Date(`${format(exitDate, "yyyy-MM-dd")}T${exitTime}`);

      if (exitDateTime > entryDateTime) {
        const durationHours = (exitDateTime.getTime() - entryDateTime.getTime()) / (1000 * 60 * 60);
        setCost(durationHours * location.pricePerHour);
      } else {
        setCost(0);
      }
    }
  };

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    // In a real app, you would submit this to your backend
    toast({
      title: "Booking Confirmed!",
      description: `Your spot at ${location.name} is booked. Total cost: $${cost.toFixed(2)}`,
    });
    // Here you would typically close the dialog
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
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
                  <Input type="time" {...field} onChange={(e) => {
                    field.onChange(e);
                    calculateCost();
                  }} />
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
                      disabled={(date) => date < (form.getValues().entryDate || new Date())}
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
                  <Input type="time" {...field} onChange={(e) => {
                    field.onChange(e);
                    calculateCost();
                  }} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                           <Wheelchair className="h-4 w-4" /> Accessible
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
                <span>${location.pricePerHour.toFixed(2)} / hour</span>
            </div>
            <div className="flex justify-between font-semibold text-xl">
                <span>Total</span>
                <span>${cost.toFixed(2)}</span>
            </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" className="w-full sm:w-auto">Confirm Booking</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
