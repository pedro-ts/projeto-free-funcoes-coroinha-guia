/**
 * @file Components/layout/MobileSafeContainer.tsx
 * @description Enquadramento adaptativo responsivo para Mobile, Tablet (iPadOS) e PC (macOS)
 * em conformidade com o Apple Human Interface Guidelines e o skill apple-design-skill.
 * 
 * - Mobile: Tela cheia dinâmica (100dvh) com proteção contra barras flutuantes e safe-areas.
 * - Tablet (iPad) e PC (Desktop): Layout expansivo fluido (max-w-6xl) com grid responsivo,
 *   tipografia equilibrada e barras de ferramentas no estilo iPadOS/macOS.
 */

"use client";

import React, { ReactNode } from "react";
import { useSafeViewport } from "@/hooks/useSafeViewport";
import { C } from "@/constants/theme";

export interface MobileSafeContainerProps {
  children: ReactNode;
  className?: string;
  allowRootScroll?: boolean;
}

export function MobileSafeContainer({
  children,
  className = "",
  allowRootScroll = false,
}: MobileSafeContainerProps) {
  useSafeViewport();

  return (
    <div
      className="w-full flex flex-col items-center justify-start min-h-[100vh] min-h-[100dvh]"
      style={{
        background: `radial-gradient(130% 120% at 50% 0%, #f7f2e7 0%, #ded4b8 100%)`,
      }}
    >
      {/*
        Container Principal Responsivo:
        - Mobile: w-full h-[100dvh]
        - Tablet / iPad (md): w-full max-w-4xl h-[100dvh]
        - Desktop / PC (lg+): w-full max-w-6xl h-[100dvh]
        - Safe Areas preservadas em todos os dispositivos
      */}
      <main
        className={`
          w-full
          max-w-full md:max-w-4xl lg:max-w-6xl
          h-[100vh] h-[100dvh]
          flex flex-col relative
          ${allowRootScroll ? "overflow-y-auto" : "overflow-hidden"}
          select-none
          md:border-x md:border-white/60 md:shadow-2xl
          transition-all duration-300
          ${className}
        `}
        style={{
          background: `linear-gradient(165deg, ${C.begeClaro} 0%, #e9e0cb 40%, ${C.begeEscuro} 100%)`,
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
          overscrollBehaviorY: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default MobileSafeContainer;
