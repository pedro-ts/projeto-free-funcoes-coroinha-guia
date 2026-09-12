/**
 * @file Components/ui/Badge.tsx
 * @description Pílula/Distintivo visual em material Apple Liquid Glass.
 */

"use client";

import React, { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "accent" | "neutral" | "subtle" | "clear";
  size?: "xs" | "sm" | "md";
  className?: string;
  onClick?: () => void;
}

export function Badge({
  children,
  variant = "accent",
  size = "sm",
  className = "",
  onClick,
}: BadgeProps) {
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px] tracking-wide",
    sm: "px-2.5 py-1 text-xs tracking-normal",
    md: "px-3.5 py-1.5 text-[13px] tracking-normal",
  };

  const variantClasses = {
    accent: "apple-glass-accent font-bold",
    neutral: "apple-glass-control text-[#774f38] font-extrabold",
    subtle: "bg-[#e08e79]/15 text-[#774f38] border border-[#e08e79]/30 font-bold backdrop-blur-md",
    clear: "apple-glass-clear text-[#774f38] font-semibold",
  };

  const Component = onClick ? "button" : "span";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-1.5 rounded-full select-none
        transition-all duration-200
        ${onClick ? "apple-touch cursor-pointer" : ""}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

export default Badge;
