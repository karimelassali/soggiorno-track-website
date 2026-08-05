'use client';
import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function BackgroundLines({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-slate-50/40", className)}>
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient radial overlay to fade lines into the edges */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#ffffff_90%] z-10" />

        <svg
          className="absolute inset-0 w-full h-full stroke-slate-200/50"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle grid mesh */}
          <defs>
            <pattern id="bento-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bento-grid)" />
          
          {/* Accent vertical lines */}
          <line x1="20%" y1="0" x2="20%" y2="100%" strokeWidth="1" className="stroke-slate-200/60" />
          <line x1="40%" y1="0" x2="40%" y2="100%" strokeWidth="1" className="stroke-slate-200/60" />
          <line x1="60%" y1="0" x2="60%" y2="100%" strokeWidth="1" className="stroke-slate-200/60" />
          <line x1="80%" y1="0" x2="80%" y2="100%" strokeWidth="1" className="stroke-slate-200/60" strokeDasharray="4 4" />
        </svg>

        {/* Floating glowing sparks sliding down the grid lines */}
        <div className="absolute inset-x-0 top-0 h-full">
          {[
            { left: '20%', delay: 0, duration: 8 },
            { left: '40%', delay: 3, duration: 12 },
            { left: '60%', delay: 1, duration: 10 },
            { left: '80%', delay: 5, duration: 14 }
          ].map((spark, idx) => (
            <motion.div
              key={idx}
              className="absolute w-[2px] h-[120px] bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent"
              style={{ left: spark.left }}
              initial={{ y: '-10%' }}
              animate={{ y: '110%' }}
              transition={{
                duration: spark.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: spark.delay,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
