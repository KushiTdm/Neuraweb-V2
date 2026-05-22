"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: { quote: string; name: string; title: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    Array.from(scrollerRef.current.children).forEach((item) => {
      scrollerRef.current!.appendChild(item.cloneNode(true));
    });

    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
    containerRef.current.style.setProperty(
      "--animation-duration",
      speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s"
    );
    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-5 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="relative w-[260px] sm:w-[340px] max-w-full shrink-0 rounded-2xl border border-gray-200/60 bg-white px-5 py-5 sm:px-8 sm:py-6 shadow-sm"
          >
            <blockquote>
              <span className="relative z-20 text-xs sm:text-sm leading-relaxed font-normal text-gray-700">
                &ldquo;{item.quote}&rdquo;
              </span>
              <div className="relative z-20 mt-4 sm:mt-6 flex flex-row items-center border-t border-gray-100 pt-3 sm:pt-4">
                <span className="flex flex-col gap-0.5">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {item.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
