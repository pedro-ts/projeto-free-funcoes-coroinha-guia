/**
 * @file Components/full-view/FullInfoSectionCard.tsx
 * @description Card individual para a visão completa em Apple Liquid Glass com HugeIcons.
 */

"use client";

import React from "react";
import { Funcao } from "@/database/schema";
import { StepMeta } from "@/constants/theme";
import { StepLiturgicalIcon } from "@/Components/ui/AppIcon";
import StepBody from "@/Components/steps/StepBody";

export interface FullInfoSectionCardProps {
  fn: Funcao;
  stepMeta: StepMeta;
  decisions: Record<string, string>;
  onDecide: (key: string, val: string) => void;
  index: number;
}

export function FullInfoSectionCard({
  fn,
  stepMeta,
  decisions,
  onDecide,
  index,
}: FullInfoSectionCardProps) {
  return (
    <section
      className="rounded-[28px] p-5 anim-fade apple-glass-card"
      style={{
        animationDelay: `${index * 0.07}s`,
      }}
    >
      {/* Cabeçalho da Seção com HugeIcon em Vidro Líquido */}
      <div className="flex items-center gap-3.5 mb-4">
        <div
          className="w-11 h-11 rounded-[18px] apple-glass flex items-center justify-center flex-shrink-0 shadow-sm text-[#774f38]"
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
          <h3 className="font-extrabold text-[15px] leading-tight text-[#774f38]">
            {stepMeta.label}
          </h3>
          <p className="text-[11px] font-bold text-[#e08e79]">
            {stepMeta.description}
          </p>
        </div>
      </div>

      {/* Conteúdo do Passo */}
      <StepBody
        fn={fn}
        stepIndex={stepMeta.index}
        decisions={decisions}
        onDecide={onDecide}
      />
    </section>
  );
}

export default FullInfoSectionCard;
