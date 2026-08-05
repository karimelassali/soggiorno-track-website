'use client';
import { cn } from '@/lib/utils';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({ text, disabled = false, speed = 4, className }: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        'text-[#b5b5b5] bg-clip-text inline-block',
        !disabled && 'animate-shine bg-[linear-gradient(120deg,rgba(120,119,198,0)_40%,rgba(255,255,255,0.9)_50%,rgba(120,119,198,0)_60%)] bg-[length:200%_100%]',
        className
      )}
      style={{
        animationDuration: disabled ? undefined : animationDuration,
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      }}
    >
      {text}
    </span>
  );
}
