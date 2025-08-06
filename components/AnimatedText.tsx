'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export default function AnimatedText({
  text,
  className = '',
  delay = 0,
  type = 'words',
  stagger = 0.05,
  duration = 0.8,
  as: Component = 'div',
}: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const splitTextRef = useRef<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !textRef.current) return;

    try {
      // Create a split text instance
      splitTextRef.current = new SplitText(textRef.current, {
        type: type,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      });

      const elements = splitTextRef.current[type];

      // Animate the split text elements
      gsap.fromTo(
        elements,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: duration,
          stagger: stagger,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    } catch (error) {
      // Fallback if SplitText fails
      console.error('Error in AnimatedText:', error);
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    return () => {
      // Clean up split text
      if (splitTextRef.current && splitTextRef.current.revert) {
        splitTextRef.current.revert();
      }
      
      // Kill any active animations
      if (textRef.current) {
        gsap.killTweensOf(textRef.current);
      }
    };
  }, [text, delay, type, stagger, duration]);

  // Use forwardRef or createElement to handle the ref properly
  return (
    <div ref={textRef} className={`overflow-hidden ${className}`}>
      <Component className="inline-block">
        {text}
      </Component>
    </div>
  );
}
