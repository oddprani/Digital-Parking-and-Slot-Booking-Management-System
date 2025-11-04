import Link from "next/link";
import {
  PanelLeft,
  BookCopy,
  CalendarDays,
  MapPin,
  AreaChart,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { ParkSmartIcon } from "@/components/icons";

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const title = isAdmin ? "Admin Dashboard" : "User Dashboard";
  const userLinks = [
    { href: "/dashboard", icon: MapPin, label: "Book Parking" },
    { href: "/dashboard/bookings", icon: BookCopy, label: "My Bookings" },
    { href: "/dashboard/availability", icon: CalendarDays, label: "Availability" },
  ];
  const adminLinks = [
    { href: "/admin", icon: AreaChart, label: "Overview" },
  ];
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <ParkSmartIcon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">ParkSmart</span>
            </Link>
            {links.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex-1">
        <h1 className="font-semibold text-xl">{title}</h1>
      </div>
      <UserNav isAdmin={isAdmin} />
    </header>
  );
}
