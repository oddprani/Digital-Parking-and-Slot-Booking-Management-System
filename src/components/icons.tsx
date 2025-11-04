import type { SVGProps } from "react";

export function ParkSmartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 15h2" />
      <path d="M12 2a5 5 0 0 1 5 5c0 4.1-3.6 8.5-5 10.8-1.4-2.3-5-6.7-5-10.8a5 5 0 0 1 5-5Z" />
      <path d="M5 21h14" />
    </svg>
  );
}
