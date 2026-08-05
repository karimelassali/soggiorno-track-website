'use client';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  const words = text.split(" ");
  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, wordIdx) => (
        <motion.span
          key={wordIdx}
          initial={{ y: "20%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + (wordIdx * 0.06)
          }}
          className="inline-block whitespace-nowrap mx-[0.15em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
