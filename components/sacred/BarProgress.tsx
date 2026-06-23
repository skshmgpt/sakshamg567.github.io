"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

interface BarProgressProps {
  intervalRate?: number;
  progress?: number;
  fillChar?: string;
}

export default function BarProgress({
  intervalRate,
  progress,
  fillChar = "░",
}: BarProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [charWidth, setCharWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof progress === "number") return;
    if (!intervalRate) return;
    const interval = setInterval(() => {
      setAnimatedProgress((prev) => (prev + 10) % 110);
    }, intervalRate);
    return () => clearInterval(interval);
  }, [intervalRate, progress]);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const rect = measureRef.current.getBoundingClientRect();
    if (rect.width > 0) {
      setCharWidth(rect.width);
    } else {
      requestAnimationFrame(() => {
        const retry = measureRef.current?.getBoundingClientRect();
        if (retry && retry.width > 0) setCharWidth(retry.width);
      });
    }
  }, [fillChar]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentProgress = progress ?? animatedProgress;
  const cappedProgress = Math.min(currentProgress, 100);
  let maxChars = 10;
  if (charWidth > 0 && containerWidth > 0) {
    maxChars = Math.max(1, Math.floor(containerWidth / charWidth));
  }
  const filledChars = Math.round((cappedProgress / 100) * maxChars);
  const barStr = fillChar.repeat(filledChars);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden select-none"
      role="progressbar"
      aria-valuenow={cappedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span ref={measureRef} className="absolute opacity-0 pointer-events-none">
        {fillChar}
      </span>
      <span className="text-[#00FF41] font-mono text-xs leading-none whitespace-pre">
        {barStr}
      </span>
    </div>
  );
}
