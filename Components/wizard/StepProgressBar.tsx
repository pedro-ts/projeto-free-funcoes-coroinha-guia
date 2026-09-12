/**
 * @file Components/wizard/StepProgressBar.tsx
 * @description Indicador de progresso dinâmico em Apple Liquid Glass com HugeIcons vetoriais.
 */

"use client";

import React from "react";
import { LITURGICAL_STEPS } from "@/constants/theme";
import { StepLiturgicalIcon } from "@/Components/ui/AppIcon";

export interface StepProgressBarProps {
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function StepProgressBar({
  currentStep,
  onStepClick,
}: StepProgressBarProps) {
  return (
    <div className="flex justify-center items-center gap-2 py-3 flex-shrink-0 select-none">
      {LITURGICAL_STEPS.map((s, i) => {
        const isActive = i === currentStep;
        const isPast = i < currentStep;

        return (
          <button
            key={s.index}
            type="button"
            onClick={() => onStepClick?.(i)}
            disabled={!onStepClick}
            className={`
              transition-all duration-300 ease-out flex items-center justify-center
              cursor-pointer p-0 border-0 outline-none
              ${isActive ? "w-9 h-7 rounded-full apple-glass-accent shadow-sm" : "w-2.5 h-2.5 rounded-full"}
            `}
            style={
              !isActive
                ? {
                    background: isPast ? "rgba(224, 142, 121, 0.55)" : "rgba(119, 79, 56, 0.2)",
                  }
                : undefined
            }
            aria-label={`Passo ${i + 1}: ${s.label}`}
          >
            {isActive && (
              <StepLiturgicalIcon
                stepIndex={i}
                size={14}
                color="#ffffff"
                strokeWidth={2.4}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default StepProgressBar;
