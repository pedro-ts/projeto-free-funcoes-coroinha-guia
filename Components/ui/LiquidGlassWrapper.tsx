/**
 * @file Components/ui/LiquidGlassWrapper.tsx
 * @description Componente utilitário que encapsula o react-liquid-glass-svg
 * com parâmetros ajustados para a paleta e estética Apple do Servire.
 */

"use client";

import React, { ReactNode, CSSProperties, ElementType } from "react";
import LiquidGlass from "react-liquid-glass-svg";

export interface LiquidGlassWrapperProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  /** Variante de transparência do vidro */
  variant?: "frosted" | "clear" | "accent" | "surface";
  /** Nível de desfoque em pixels (padrão: 24) */
  blur?: number;
  /** Intensidade do mapa de refração e distorção líquida (padrão: 10) */
  displacement?: number;
}

export function LiquidGlassWrapper({
  children,
  className = "",
  style,
  as = "div",
  variant = "frosted",
  blur = 24,
  displacement = 8,
}: LiquidGlassWrapperProps) {
  // Ajuste de tonalidade conforme a variante litúrgica
  const tintColorMap = {
    frosted: "rgba(255, 255, 255, 0.68)",
    clear: "rgba(255, 255, 255, 0.42)",
    accent: "rgba(224, 142, 121, 0.82)",
    surface: "rgba(255, 255, 255, 0.78)",
  };

  return (
    <LiquidGlass
      as={as}
      className={className}
      style={style}
      backdropBlur={blur}
      displacementScale={displacement}
      glassBorder={true}
      tintColor={tintColorMap[variant]}
    >
      {children}
    </LiquidGlass>
  );
}

export default LiquidGlassWrapper;
