import React from "react";
import { cn } from "@/lib/utils";

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("w-9 h-9", className)} fill="none">
      <defs>
        <linearGradient
          id="neon-green-core"
          x1="10"
          y1="4"
          x2="24"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#2DF2A6"></stop>
          <stop offset="0.5" stopColor="#22c55e"></stop>
          <stop offset="1" stopColor="#bbf7d0"></stop>
        </linearGradient>
      </defs>
      <path
        d="M13 3L7 15H14L10 29L25 13H17L23 3H13Z"
        fill="url(#neon-green-core)"
        stroke="#2DF2A6"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.98"
      ></path>
      <path
        d="M13 3L7 15H14L10 29L25 13H17L23 3H13Z"
        fill="none"
        stroke="#a7f3d0"
        strokeWidth="0.9"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.6"
      ></path>
      <filter id="neon-green-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.4" result="blur"></feGaussianBlur>
      </filter>
      <g filter="url(#neon-green-glow)" opacity="0.6">
        <path
          d="M13 3L7 15H14L10 29L25 13H17L23 3H13Z"
          fill="#2DF2A6"
          fillOpacity="0.35"
        ></path>
      </g>
    </svg>
  );
}
