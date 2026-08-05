'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT';

interface HoverBorderGradientProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  containerClassName?: string;
  className?: string;
  as?: React.ElementType;
  duration?: number;
  clockwise?: boolean;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Component = 'button',
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>('TOP');

  const directionsList: Direction[] = ['TOP', 'RIGHT', 'BOTTOM', 'LEFT'];

  useEffect(() => {
    if (!hovered) return;

    const interval = setInterval(() => {
      setDirection((prevState) => {
        const currentIndex = directionsList.indexOf(prevState);
        const nextIndex = clockwise
          ? (currentIndex + 1) % directionsList.length
          : (currentIndex - 1 + directionsList.length) % directionsList.length;
        return directionsList[nextIndex];
      });
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [hovered, duration, clockwise]);

  const mapDirectionToGradient = (dir: Direction) => {
    switch (dir) {
      case 'TOP':
        return 'radial-gradient(20% 50% at 50% 0%, #10b981 0%, rgba(16,185,129,0) 100%)';
      case 'RIGHT':
        return 'radial-gradient(50% 20% at 100% 50%, #10b981 0%, rgba(16,185,129,0) 100%)';
      case 'BOTTOM':
        return 'radial-gradient(20% 50% at 50% 100%, #10b981 0%, rgba(16,185,129,0) 100%)';
      case 'LEFT':
        return 'radial-gradient(50% 20% at 0% 50%, #10b981 0%, rgba(16,185,129,0) 100%)';
    }
  };

  return (
    <Component
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex content-center bg-black/5 hover:bg-black/10 transition-colors duration-500 rounded-2xl p-[1px] overflow-hidden justify-center items-center',
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          'w-full text-slate-800 bg-white/95 backdrop-blur-md rounded-2xl z-10 px-8 py-4 font-bold text-sm flex items-center justify-center gap-2',
          className
        )}
      >
        {children}
      </div>
      
      {/* Dynamic Laser Border */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: mapDirectionToGradient(direction),
        }}
        animate={{
          opacity: hovered ? 1 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />
    </Component>
  );
}
