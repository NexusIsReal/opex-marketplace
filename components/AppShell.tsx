"use client";
import { usePathname } from 'next/navigation';
import { HexagonBackground } from '@/components/animate-ui/backgrounds/hexagon';
import SmoothScroll from './SmoothScroll';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const usePlainBg = pathname?.startsWith('/profile');

  if (usePlainBg) {
    return (
      <div className="min-h-screen w-full bg-[#0b0b0b]">
        <SmoothScroll>{children}</SmoothScroll>
      </div>
    );
  }

  return (
    <HexagonBackground className="min-h-screen w-full" hexagonSize={70} hexagonMargin={2}>
      <SmoothScroll>{children}</SmoothScroll>
    </HexagonBackground>
  );
}
