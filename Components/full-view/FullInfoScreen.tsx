/**
 * @file Components/full-view/FullInfoScreen.tsx
 * @description Visão consolidada de todas as etapas em Apple Liquid Glass (react-liquid-glass-svg)
 * com cabeçalho 100% de largura, sem sensação de card isolado e layout espaçoso.
 */

"use client";

import React from "react";
import { Funcao } from "@/database/schema";
import { LITURGICAL_STEPS } from "@/constants/theme";
import { IconArrowBack } from "@/Components/ui/AppIcon";
import LiquidGlassWrapper from "@/Components/ui/LiquidGlassWrapper";
import FullInfoSectionCard from "./FullInfoSectionCard";

export interface FullInfoScreenProps {
  fn: Funcao;
  decisions: Record<string, string>;
  onDecide: (key: string, val: string) => void;
  onBack: () => void;
}

export function FullInfoScreen({
  fn,
  decisions,
  onDecide,
  onBack,
}: FullInfoScreenProps) {
  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col relative">
      {/*
        Barra Superior em Liquid Glass 100% de Largura
      */}
      <header className="sticky top-0 z-30 w-full flex-shrink-0">
        <LiquidGlassWrapper
          variant="frosted"
          blur={28}
          displacement={6}
          className="w-full rounded-none rounded-b-[24px] border-t-0 border-x-0 border-b border-white/80 shadow-md"
        >
          <div className="w-full max-w-full md:max-w-4xl lg:max-w-5xl mx-auto px-5 pt-3 pb-3 flex flex-col gap-2">
            {/* Linha 1: Botão Voltar aos Passos */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={onBack}
                className="px-3.5 py-1.5 rounded-full bg-white/90 text-[#774f38] border border-white/95 apple-touch flex items-center gap-1.5 shadow-xs font-black text-xs cursor-pointer"
                aria-label="Voltar para a visualização passo a passo"
                title="Voltar aos Passos da Função"
              >
                <IconArrowBack size={15} strokeWidth={2.4} />
                <span>Voltar aos Passos</span>
              </button>
            </div>

            {/* Linha 2: Subtítulo e Título Completo sem Truncamento */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#e08e79]">
                Visão Completa
              </p>
              <h1 className="text-base sm:text-lg font-black leading-tight text-[#774f38] line-clamp-2">
                {fn.nome}
              </h1>
            </div>
          </div>
        </LiquidGlassWrapper>
      </header>

      {/* Seções em Sequência */}
      <div className="px-5 pt-4 pb-24 flex-1 w-full max-w-full md:max-w-4xl lg:max-w-5xl mx-auto">
        <div className="space-y-4">
          {LITURGICAL_STEPS.map((s, i) => (
            <FullInfoSectionCard
              key={s.index}
              fn={fn}
              stepMeta={s}
              decisions={decisions}
              onDecide={onDecide}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FullInfoScreen;
