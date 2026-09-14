/**
 * @file Components/wizard/WizardScreen.tsx
 * @description Tela do Wizard litúrgico com navegação integrada diretamente ao canvas,
 * dois botões 'Ver Tudo' (topo e botão flutuante no canto inferior direito),
 * retorno à tela inicial destacado e avanço automático para visão completa no último passo.
 */

"use client";

import React from "react";
import { Funcao } from "@/database/schema";
import { LITURGICAL_STEPS, TOTAL_STEPS } from "@/constants/theme";
import { IconLayers } from "@/Components/ui/AppIcon";
import WizardHeader from "./WizardHeader";
import StepProgressBar from "./StepProgressBar";
import StepNavigationButtons from "./StepNavigationButtons";
import StepCard from "./StepCard";
import StepFooterHint from "./StepFooterHint";

export interface WizardScreenProps {
  fn: Funcao;
  step: number;
  direction: "forward" | "backward";
  animKey: number;
  decisions: Record<string, string>;
  onDecide: (key: string, val: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onGoToStep: (stepIndex: number) => void;
  onBackToHome: () => void;
  onViewAll: () => void;
}

export function WizardScreen({
  fn,
  step,
  direction,
  animKey,
  decisions,
  onDecide,
  onNext,
  onPrev,
  onGoToStep,
  onBackToHome,
  onViewAll,
}: WizardScreenProps) {
  const currentStepMeta = LITURGICAL_STEPS[step] || LITURGICAL_STEPS[0];
  const isFirst = step === 0;
  const isLast = step === TOTAL_STEPS - 1;

  // Ao tocar em avançar no último passo, leva diretamente para a tela de Visão Completa
  const handleNextOrFinish = () => {
    if (isLast) {
      onViewAll();
    } else {
      onNext();
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none relative">
      {/* 1. Cabeçalho Superior com Retorno Destacado e 1º Botão 'Ver Tudo' */}
      <WizardHeader
        functionName={fn.nome}
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onBack={onBackToHome}
        onViewAll={onViewAll}
      />

      {/* 2. Barra de Progresso com Micro HugeIcons */}
      <StepProgressBar
        currentStep={step}
        onStepClick={onGoToStep}
      />

      {/* 3. Área Principal: O Conteúdo flui livremente pela tela sem aspecto de 'caixa/card' isolada */}
      <div className="flex-1 relative flex items-stretch overflow-hidden">
        {/* Setas Laterais Flutuantes */}
        <StepNavigationButtons
          isFirst={isFirst}
          isLast={isLast}
          onPrev={onPrev}
          onNext={handleNextOrFinish}
        />

        {/* Conteúdo Natural da Etapa */}
        <StepCard
          fn={fn}
          stepMeta={currentStepMeta}
          direction={direction}
          animKey={animKey}
          decisions={decisions}
          onDecide={onDecide}
        />
      </div>

      {/* 4. Dica de Ação Inferior */}
      <StepFooterHint
        isFirst={isFirst}
        isLast={isLast}
      />

      {/*
        ── 5. Botão Flutuante Redondo no Canto Inferior Esquerdo ──
        Posicionado um pouco mais alto para evitar conflito com a barra de navegação/gestos do sistema
      */}
      <div className="absolute bottom-24 left-4 sm:bottom-28 sm:left-6 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={onViewAll}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full apple-glass-accent apple-touch shadow-2xl border border-white/85 flex items-center justify-center cursor-pointer text-white hover:scale-105 transition-transform"
          title="Ver Completo (Visão Geral)"
          aria-label="Ver Completo (Visão Geral)"
        >
          <IconLayers size={22} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

export default WizardScreen;
