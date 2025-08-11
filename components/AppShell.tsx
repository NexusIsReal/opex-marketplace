"use client";
import { usePathname } from 'next/navigation';
import SmoothScroll from './SmoothScroll';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  return (
    <div className="min-h-screen w-full bg-[#0b0b0b]">
      <SmoothScroll>
        {isAdminPage ? (
          // Admin pages - no header/footer
          <>{children}</>
        ) : (
          // Non-admin pages - with header/footer
          <div className="flex min-h-screen flex-col">
            <Header fixed />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        )}
      </SmoothScroll>
    </div>
  );
}
