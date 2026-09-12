/**
 * @file hooks/useWizard.ts
 * @description Hook customizado para gerenciar a navegação passo a passo (Wizard),
 * o sentido das transições animadas e as escolhas de decisão do usuário.
 */

"use client";

import { useState, useCallback } from "react";
import { TOTAL_STEPS } from "@/constants/theme";

export interface UseWizardReturn {
  /** Índice do passo atual (0 a TOTAL_STEPS - 1) */
  step: number;
  /** Direção da transição para acionamento da classe de animação correta */
  direction: "forward" | "backward";
  /** Chave numérica que força o recarregamento do elemento DOM e animação CSS */
  animKey: number;
  /** Mapa com as opções selecionadas pelo usuário (ex: "1-1": "Cantada") */
  decisions: Record<string, string>;
  /** Indica se está no primeiro passo */
  isFirst: boolean;
  /** Indica se está no último passo */
  isLast: boolean;
  /** Avança para o próximo passo */
  goNext: () => void;
  /** Retorna para o passo anterior */
  goPrev: () => void;
  /** Navega diretamente para um passo específico */
  goToStep: (targetStep: number) => void;
  /** Salva ou redefine a decisão de uma etapa */
  setDecision: (key: string, value: string) => void;
  /** Reseta o estado do wizard para o início */
  resetWizard: () => void;
}

export function useWizard(initialStep: number = 0): UseWizardReturn {
  const [step, setStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey] = useState<number>(0);
  const [decisions, setDecisions] = useState<Record<string, string>>({});

  const goNext = useCallback(() => {
    setStep((current) => {
      if (current < TOTAL_STEPS - 1) {
        setDirection("forward");
        setAnimKey((k) => k + 1);
        return current + 1;
      }
      return current;
    });
  }, []);

  const goPrev = useCallback(() => {
    setStep((current) => {
      if (current > 0) {
        setDirection("backward");
        setAnimKey((k) => k + 1);
        return current - 1;
      }
      return current;
    });
  }, []);

  const goToStep = useCallback((targetStep: number) => {
    if (targetStep >= 0 && targetStep < TOTAL_STEPS) {
      setStep((current) => {
        setDirection(targetStep >= current ? "forward" : "backward");
        setAnimKey((k) => k + 1);
        return targetStep;
      });
    }
  }, []);

  const setDecision = useCallback((key: string, value: string) => {
    setDecisions((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetWizard = useCallback(() => {
    setStep(0);
    setDirection("forward");
    setAnimKey(0);
    setDecisions({});
  }, []);

  return {
    step,
    direction,
    animKey,
    decisions,
    isFirst: step === 0,
    isLast: step === TOTAL_STEPS - 1,
    goNext,
    goPrev,
    goToStep,
    setDecision,
    resetWizard,
  };
}
