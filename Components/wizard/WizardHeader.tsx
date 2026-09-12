/**
 * @file Components/wizard/WizardHeader.tsx
 * @description Cabeçalho do Wizard com disposição limpa e espaçosa:
 * - Botões de ação na linha superior (Início e Ver Tudo)
 * - Título completo da função e indicador de passo sem truncamento
 * - 100% de largura, integrado ao topo sem parecer card isolado
 */

"use client";

import React from "react";
import { IconArrowBack, IconLayers } from "@/Components/ui/AppIcon";
import LiquidGlassWrapper from "@/Components/ui/LiquidGlassWrapper";

export interface WizardHeaderProps {
  functionName: string;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onViewAll: () => void;
}

export function WizardHeader({
  functionName,
  currentStep,
  totalSteps,
  onBack,
  onViewAll,
}: WizardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full flex-shrink-0">
      <LiquidGlassWrapper
        variant="frosted"
        blur={26}
        displacement={6}
        className="w-full rounded-none rounded-b-[24px] border-t-0 border-x-0 border-b border-white/80 shadow-md"
      >
        <div className="w-full max-w-full md:max-w-4xl lg:max-w-6xl mx-auto px-5 pt-3 pb-3 flex flex-col gap-2">
          {/* Linha 1: Controles de Navegação (Tela Inicial à esquerda, Ver Tudo à direita) */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-full bg-white/90 text-[#774f38] border border-white/95 apple-touch flex items-center gap-1.5 shadow-xs font-black text-xs cursor-pointer"
              aria-label="Voltar para a tela inicial de funções"
              title="Voltar para a Tela Inicial"
            >
              <IconArrowBack size={15} strokeWidth={2.4} />
              <span>Tela Inicial</span>
            </button>

            <button
              type="button"
              onClick={onViewAll}
              className="px-3.5 py-1.5 rounded-full apple-glass-accent apple-touch flex items-center gap-1.5 text-xs font-black shadow-sm cursor-pointer text-white"
              title="Abrir a visão completa de todos os passos"
            >
              <IconLayers size={14} strokeWidth={2.4} />
              <span>Ver Tudo</span>
            </button>
          </div>

          {/* Linha 2: Título Completo sem Truncamento + Contador de Passos */}
          <div className="flex items-baseline justify-between gap-3 pt-0.5">
            <h2 className="text-[15px] sm:text-base font-black text-[#774f38] leading-snug line-clamp-1">
              {functionName}
            </h2>
            <span className="text-[11px] font-bold text-[#e08e79] flex-shrink-0">
              Passo {currentStep + 1} de {totalSteps}
            </span>
          </div>
        </div>
      </LiquidGlassWrapper>
    </header>
  );
}

export default WizardHeader;
