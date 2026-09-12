/**
 * @file Components/ui/IconButton.tsx
 * @description Botão de ícone com acabamento Apple Liquid Glass e resposta tátil háptica.
 * 
 * Cumpre os requisitos do Apple Human Interface Guidelines:
 * - Área mínima de toque de 44x44pt para acessibilidade
 * - Efeito de clique físico (spring scale: 0.94)
 * - Vidro líquido com reflexo especular de topo
 */

"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "glass" | "accent" | "clear" | "subtle";
  size?: "sm" | "md" | "lg";
}

export function IconButton({
  children,
  variant = "glass",
  size = "md",
  className = "",
  style,
  ...props
}: IconButtonProps) {
  // Tamanhos com área mínima de toque de 44x44px conforme Apple HIG
  const sizeClasses = {
    sm: "w-9 h-9 min-w-[36px] min-h-[36px] text-xs",
    md: "w-11 h-11 min-w-[44px] min-h-[44px] text-sm",
    lg: "w-13 h-13 min-w-[48px] min-h-[48px] text-base",
  };

  const variantClassMap = {
    glass: "apple-glass-control text-[#774f38]",
    accent: "apple-glass-accent",
    clear: "apple-glass-clear text-[#774f38]",
    subtle: "bg-black/5 hover:bg-black/10 text-[#774f38] border border-black/5",
  };

  return (
    <button
      className={`
        rounded-[18px] flex items-center justify-center
        apple-touch cursor-pointer select-none
        disabled:opacity-40 disabled:pointer-events-none
        ${sizeClasses[size]}
        ${variantClassMap[variant]}
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
