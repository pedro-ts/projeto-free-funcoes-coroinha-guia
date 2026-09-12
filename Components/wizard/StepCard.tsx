/**
 * @file Components/wizard/StepCard.tsx
 * @description Apresentação do passo litúrgico diretamente integrado ao canvas da tela.
 * 
 * - Margens laterais ampliadas (px-14 sm:px-16) para garantir que as setas laterais
 *   nunca fiquem por cima do texto ou dos botões de opções.
 * - Conteúdo flui naturalmente sem aspecto de 'card dentro de tela'.
 */

"use client";

import React from "react";
import { Funcao } from "@/database/schema";
import { StepMeta } from "@/constants/theme";
import { StepLiturgicalIcon } from "@/Components/ui/AppIcon";
import StepBody from "@/Components/steps/StepBody";

export interface StepCardProps {
  fn: Funcao;
  stepMeta: StepMeta;
  direction: "forward" | "backward";
  animKey: number;
  decisions: Record<string, string>;
  onDecide: (key: string, val: string) => void;
}

export function StepCard({
  fn,
  stepMeta,
  direction,
  animKey,
  decisions,
  onDecide,
}: StepCardProps) {
  const animationClass =
    direction === "forward" ? "anim-slide-right" : "anim-slide-left";

  return (
    <div
      key={animKey}
      className={`
        flex-1 w-full h-full overflow-y-auto
        px-14 sm:px-16 md:px-20 pt-2 pb-28
        no-scrollbar select-text
        ${animationClass}
      `}
    >
      <div className="max-w-2xl mx-auto flex flex-col min-h-full">
        {/* Cabeçalho da Etapa: Integrado à Tela sem Caixa Isolada */}
        <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-[#774f38]/10 flex-shrink-0">
          <div
            className="w-12 h-12 rounded-[18px] apple-glass flex items-center justify-center flex-shrink-0 shadow-sm text-[#774f38]"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 212, 175, 0.7) 100%)",
            }}
          >
            <StepLiturgicalIcon
              stepIndex={stepMeta.index}
              size={22}
              strokeWidth={2}
            />
          </div>

          <div>
            <h1 className="font-black text-xl leading-tight text-[#774f38]">
              {stepMeta.label}
            </h1>
            <p className="text-xs font-bold text-[#e08e79] mt-0.5">
              {stepMeta.description}
            </p>
          </div>
        </div>

        {/* Corpo do Conteúdo */}
        <div className="flex-1 pb-6">
          <StepBody
            fn={fn}
            stepIndex={stepMeta.index}
            decisions={decisions}
            onDecide={onDecide}
          />
        </div>
      </div>
    </div>
  );
}

export default StepCard;
