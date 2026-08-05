'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

export function HoverEffect({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
    badge?: string;
    colSpan?: string;
  }[];
  className?: string;
}) {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 gap-4 py-8",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          onClick={item.onClick}
          className={cn(
            "relative group block p-2 h-full w-full",
            item.colSpan || "md:col-span-2",
            item.onClick ? "cursor-pointer" : ""
          )}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-emerald-500/[0.06] dark:bg-emerald-500/[0.04] block rounded-[2.5rem]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.1 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="rounded-[2rem] h-full w-full p-8 md:p-10 overflow-hidden bg-white border border-slate-100 hover:border-emerald-500/10 shadow-2xs group-hover:shadow-xs transition-all duration-300 relative z-10 flex flex-col justify-between">
            <div className="relative z-50">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100/80 text-emerald-600 mb-8 group-hover:scale-105 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all duration-300 shadow-3xs">
                {item.icon}
              </div>
              <h3 className="text-slate-800 font-bold tracking-tight text-lg md:text-xl mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                {item.description}
              </p>
            </div>
            {item.badge && (
              <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 font-mono tracking-wide uppercase">
                  {item.badge}
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-100 group-hover:bg-emerald-50 transition-all duration-300">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
