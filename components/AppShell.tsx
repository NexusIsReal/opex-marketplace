"use client";
import { usePathname } from 'next/navigation';
import SmoothScroll from './SmoothScroll';

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Use a flat black background across the app (remove hexagon background)
  // Keeping usePathname import in case future per-route styling is needed
  usePathname();
  return (
    <div className="min-h-screen w-full bg-[#0b0b0b]">
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
