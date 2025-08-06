'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  threshold?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 40,
  className = '',
  threshold = 0.15,
}: FadeInProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Set initial position based on direction
    const directionMap = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      none: {},
    };

    const initialProps = {
      opacity: 0,
      ...directionMap[direction],
    };

    // Animate to final position
    gsap.fromTo(
      elementRef.current,
      initialProps,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: `top ${100 - threshold * 100}%`,
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      // Clean up animations
      if (elementRef.current) {
        gsap.killTweensOf(elementRef.current);
      }
    };
  }, [delay, duration, direction, distance, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
