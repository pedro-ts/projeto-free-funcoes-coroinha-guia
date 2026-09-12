/**
 * @file Components/wizard/StepNavigationButtons.tsx
 * @description Zonas de toque laterais amplas para navegação rápida entre passos:
 * - Sem fundo pesado de botão (apenas ícones nítidos e área de clique ampla de ponta a ponta)
 * - Tocar em qualquer ponto do lado direito passa a página
 * - Tocar em qualquer ponto do lado esquerdo volta a página
 */

"use client";

import React from "react";
import { IconChevronLeft, IconChevronRight } from "@/Components/ui/AppIcon";

export interface StepNavigationButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function StepNavigationButtons({
  isFirst,
  isLast,
  onPrev,
  onNext,
}: StepNavigationButtonsProps) {
  return (
    <>
      {/* Zona de Toque Lateral Esquerda (Voltar Passo Anterior) */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className={`
          absolute left-0 top-0 bottom-0 w-14 sm:w-16 z-20
          flex items-center justify-center
          cursor-pointer select-none transition-all duration-200
          hover:opacity-100 active:scale-90
          ${isFirst ? "opacity-0 pointer-events-none" : "opacity-85 hover:opacity-100"}
        `}
        aria-label="Voltar para o passo anterior"
        title="Passo Anterior"
      >
        <div className="text-[#b94a2e] drop-shadow-md anim-nudge-left flex items-center justify-center">
          <IconChevronLeft size={34} strokeWidth={3.2} />
        </div>
      </button>

      {/* Zona de Toque Lateral Direita (Avançar Próximo Passo) */}
      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        className={`
          absolute right-0 top-0 bottom-0 w-14 sm:w-16 z-20
          flex items-center justify-center
          cursor-pointer select-none transition-all duration-200
          hover:opacity-100 active:scale-90
          ${isLast ? "opacity-0 pointer-events-none" : "opacity-85 hover:opacity-100"}
        `}
        aria-label="Avançar para o próximo passo"
        title="Próximo Passo"
      >
        <div className="text-[#b94a2e] drop-shadow-md anim-nudge-right flex items-center justify-center">
          <IconChevronRight size={34} strokeWidth={3.2} />
        </div>
      </button>
    </>
  );
}

export default StepNavigationButtons;
