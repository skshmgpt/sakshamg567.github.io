"use client";

import React, { useState, useRef } from "react";

interface SidebarLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  defaultSidebarWidth?: number;
  isShowingHandle?: boolean;
  isReversed?: boolean;
}

const CHARACTER_WIDTH = 9.6;

export default function SidebarLayout({
  defaultSidebarWidth = 20,
  children,
  sidebar,
  isShowingHandle = false,
  isReversed = false,
  className,
  ...rest
}: SidebarLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const handleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const startX = event.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const increment = Math.round(deltaX / CHARACTER_WIDTH);
      setSidebarWidth(Math.max(CHARACTER_WIDTH, startWidth + increment));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  if (isReversed) {
    return (
      <div className={`flex w-full flex-row overflow-hidden ${className ?? ""}`} {...rest}>
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
        <div aria-hidden="true" className="hidden w-[1ch] shrink-0 md:block" />
        <div
          className="hidden h-full shrink-0 overflow-y-auto border-l border-[#1F1F1C] md:block"
          style={{ width: `${sidebarWidth}ch` }}
        >
          {sidebar}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-row overflow-hidden ${className ?? ""}`} {...rest}>
      <div
        className="hidden h-full shrink-0 overflow-y-auto border-r border-[#1F1F1C] md:block"
        style={{ width: `${sidebarWidth}ch` }}
      >
        {sidebar}
      </div>
      {isShowingHandle ? (
        <div
          ref={handleRef}
          role="button"
          tabIndex={0}
          onMouseDown={handleMouseDown}
          className="hidden w-[0.5ch] shrink-0 cursor-col-resize flex-col items-center justify-center gap-[2px] bg-[#111110] hover:bg-[#1F1F1C] md:flex"
        >
          <div className="w-0.5 h-3 bg-[#1F1F1C]" />
          <div className="w-0.5 h-3 bg-[#1F1F1C]" />
        </div>
      ) : null}
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
