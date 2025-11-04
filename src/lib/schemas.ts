import { z } from "zod";

export const bookingSchema = z.object({
  entryDate: z.date({
    required_error: "Entry date is required.",
  }),
  entryTime: z.string().min(1, { message: "Entry time is required." }),
  exitDate: z.date({
    required_error: "Exit date is required.",
  }),
  exitTime: z.string().min(1, { message: "Exit time is required." }),
  parkingType: z.enum(["standard", "ev", "accessible"]),
}).refine(data => {
    const entryDateTime = new Date(`${data.entryDate.toISOString().split('T')[0]}T${data.entryTime}`);
    const exitDateTime = new Date(`${data.exitDate.toISOString().split('T')[0]}T${data.exitTime}`);
    return exitDateTime > entryDateTime;
}, {
    message: "Exit date and time must be after entry date and time.",
    path: ["exitTime"],
});
