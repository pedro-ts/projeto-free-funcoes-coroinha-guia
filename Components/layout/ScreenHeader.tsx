/**
 * @file Components/layout/ScreenHeader.tsx
 * @description Barra de cabeçalho Apple Liquid Glass com reflexo translúcido e tipografia nítida.
 */

"use client";

import React, { ReactNode } from "react";

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  sticky?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  sticky = true,
}: ScreenHeaderProps) {
  return (
    <header
      className={`
        w-full px-5 pt-3 pb-3 flex items-center justify-between flex-shrink-0
        apple-glass
        ${sticky ? "sticky top-0 z-30" : "relative z-10"}
      `}
      style={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {leftSlot}
        <div className="min-w-0">
          {subtitle && (
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#e08e79]">
              {subtitle}
            </p>
          )}
          <h1 className="text-base font-extrabold leading-tight truncate text-[#774f38]">
            {title}
          </h1>
        </div>
      </div>

      {rightSlot && <div className="flex items-center flex-shrink-0 ml-2">{rightSlot}</div>}
    </header>
  );
}

export default ScreenHeader;
