'use client';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Content with positive z-index */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6, scale: 0.985, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, scale: 0.985, filter: 'blur(4px)' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex items-center justify-center"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
