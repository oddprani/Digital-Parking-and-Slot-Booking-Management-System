"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ParkSmartIcon } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const authBgImage = PlaceHolderImages.find((img) => img.id === "auth-bg");
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName: values.name });

      // Create user document in Firestore
      const userDocRef = doc(firestore, "users", user.uid);
      setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        firstName: values.name.split(" ")[0] || "",
        lastName: values.name.split(" ").slice(1).join(" ") || "",
        email: user.email,
        registrationDate: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: "Registration Successful",
        description: "You can now log in with your credentials.",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create account.",
      });
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="flex items-center justify-center gap-2">
              <ParkSmartIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">ParkSmart</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Create an account to start managing your parking.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {authBgImage && (
          <Image
            src={authBgImage.imageUrl}
            alt="Parking lot"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            data-ai-hint={authBgImage.imageHint}
          />
        )}
      </div>
    </div>
  );
}
