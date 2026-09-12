/**
 * @file Components/wizard/StepFooterHint.tsx
 * @description Rodapé contextual informativo em Apple Liquid Glass com HugeIcons.
 * Mantém apenas texto indicativo sem botões duplicados de 'Ver Tudo'.
 */

"use client";

import React from "react";
import { IconChevronLeft, IconChevronRight } from "@/Components/ui/AppIcon";

export interface StepFooterHintProps {
  isFirst: boolean;
  isLast: boolean;
}

export function StepFooterHint({ isFirst, isLast }: StepFooterHintProps) {
  return (
    <footer
      className="flex-shrink-0 px-5 pt-1 pb-3 select-none z-20"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)",
      }}
    >
      <div className="flex items-center justify-center">
        <div className="rounded-full py-2 px-4 flex items-center justify-center gap-1.5 apple-glass-clear text-[#e08e79] text-xs font-bold shadow-xs">
          {isFirst && !isLast && (
            <>
              <span>Toque</span>
              <IconChevronRight size={13} strokeWidth={2.8} />
              <span>para avançar</span>
            </>
          )}
          {!isFirst && !isLast && (
            <>
              <span>Navegue usando</span>
              <IconChevronLeft size={13} strokeWidth={2.8} />
              <span>ou</span>
              <IconChevronRight size={13} strokeWidth={2.8} />
            </>
          )}
          {isLast && (
            <span>Final do guia · Toque em &ldquo;Ver Tudo&rdquo; para o resumo</span>
          )}
        </div>
      </div>
    </footer>
  );
}

export default StepFooterHint;
