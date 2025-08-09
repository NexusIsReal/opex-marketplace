"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: string;
  glowIntensity?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "132, 0, 255",
  glowSize = "400px", // Larger glow size for better visibility
  glowIntensity = "0.8",
  enableTilt = true,
  clickEffect = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      // Set initial glow on hover
      card.style.setProperty("--glow-intensity", "1");
      card.style.setProperty("--glow-radius", glowSize);
      card.style.setProperty("--border-glow", "1");
      card.classList.add("glowing");
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate position for glow effect
      const relativeX = ((x) / rect.width) * 100;
      const relativeY = ((y) / rect.height) * 100;
      
      // Update glow position with smoother animation
      card.style.setProperty("--glow-x", `${relativeX}%`);
      card.style.setProperty("--glow-y", `${relativeY}%`);
      card.style.setProperty("--glow-intensity", "1");
      card.style.setProperty("--glow-radius", glowSize);
      
      // Calculate border glow position
      const angleRad = Math.atan2(y - centerY, x - centerX);
      const angleDeg = (angleRad * 180 / Math.PI + 360) % 360;
      card.style.setProperty("--border-angle", `${angleDeg}deg`);

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      if (enableTilt) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      
      // Reset glow
      card.style.setProperty("--glow-intensity", "0");
      card.style.setProperty("--border-glow", "0");
      card.classList.remove("glowing");
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      card.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("click", handleClick);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("click", handleClick);
    };
  }, [enableTilt, clickEffect, glowColor]);

  return (
    <>
      <style jsx>{`
        .card--border-glow {
          position: relative;
          z-index: 1;
        }
        
        .card--border-glow {
          position: relative;
          overflow: visible;
        }
        
        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: -2px;
          z-index: -1;
          border-radius: inherit;
          background: transparent;
          border: 2px solid transparent;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          box-shadow: 0 0 15px 3px rgba(${glowColor}, calc(var(--glow-intensity) * 0.5));
          transition: all 0.3s ease;
        }
        
        .card--border-glow.glowing::before {
          border-image: linear-gradient(var(--border-angle), rgba(${glowColor}, 1), rgba(${glowColor}, 0.3), rgba(${glowColor}, 1)) 1;
          animation: rotate 4s linear infinite;
        }
        
        .card--border-glow::after {
          content: '';
          position: absolute;
          inset: -2px;
          z-index: -1;
          border-radius: inherit;
          background: radial-gradient(
            circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, var(--glow-intensity)),
            transparent calc(var(--glow-radius) * 0.5)
          );
          opacity: var(--glow-intensity);
          pointer-events: none;
          transition: opacity 0.3s, background 0.3s;
        }
        
        @keyframes rotate {
          from {
            --border-angle: 0deg;
          }
          to {
            --border-angle: 360deg;
          }
        }
      `}</style>
      <div
        ref={cardRef}
        className={`card--border-glow ${className}`}
        style={{
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-intensity": glowIntensity,
          "--glow-radius": glowSize,
          "--border-glow": "0",
          "--border-angle": "0deg",
        } as React.CSSProperties}
      >
        {children}
      </div>
    </>
  );
};

export default GlowCard;
