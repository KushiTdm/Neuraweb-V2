'use client';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useState, useEffect, type CSSProperties } from 'react';

type IconProps = { className?: string; style?: CSSProperties };

const CheckFilled = ({ className, style }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn('w-[18px] h-[18px]', className)}
    style={style}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckOutline = ({ className, style }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={cn('w-[18px] h-[18px]', className)}
    style={style}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

type Step = { text: string };

export function MultiStepLoader({
  steps,
  active = false,
  duration = 2000,
}: {
  steps: Step[];
  active?: boolean;
  duration?: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => {
      setCurrent((prev) => (prev >= steps.length - 1 ? 0 : prev + 1));
    }, duration);
    return () => clearTimeout(timeout);
  }, [current, active, duration, steps.length]);

  return (
    <div className="space-y-3.5">
      {steps.map((step, index) => {
        const distance = Math.abs(index - current);
        const opacity = active ? Math.max(1 - distance * 0.18, 0.25) : 1;
        const isActive = active && index === current;
        const isDone = active && index < current;

        return (
          <motion.div
            key={index}
            animate={{ opacity }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3"
          >
            {/* Icon bubble */}
            <span
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{
                background: isActive ? '#C5F277' : isDone ? '#ffffff' : '#E8F4FD',
              }}
            >
              {isDone ? (
                <CheckFilled style={{ color: 'white' }} />
              ) : isActive ? (
                <CheckFilled style={{ color: '#0E1B3D' }} />
              ) : (
                <CheckOutline style={{ color: '#ffffff' }} />
              )}
            </span>

            {/* Label */}
            <span
              className="text-sm leading-snug transition-all duration-300"
              style={{
                color: isActive ? '#0E1B3D' : '#64748b',
                fontWeight: isActive ? '600' : '500',
              }}
            >
              {step.text}
            </span>

            {/* Progress bar for active item */}
            {isActive && (
              <motion.span
                key={`bar-${current}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="ml-auto h-0.5 w-10 rounded-full origin-left flex-shrink-0"
                style={{ background: '#C5F277' }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
