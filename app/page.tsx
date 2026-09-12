/**
 * @file app/page.tsx
 * @description Página principal do Servire.
 * 
 * Orquestra os três fluxos centrais da aplicação:
 * 1. Catálogo de Funções (HomeScreen)
 * 2. Navegação Passo a Passo Guiada (WizardScreen)
 * 3. Visão Completa Consolidada (FullInfoScreen)
 * 
 * Tudo envelopado dentro do MobileSafeContainer para proteção total contra
 * barras superiores e inferiores dos navegadores móveis (Safari no iOS e Chrome no Android).
 */

"use client";

import React, { useState } from "react";
import { Funcao } from "@/database";
import { useWizard } from "@/hooks/useWizard";
import { MobileSafeContainer } from "@/Components/layout/MobileSafeContainer";
import { HomeScreen } from "@/Components/home/HomeScreen";
import { WizardScreen } from "@/Components/wizard/WizardScreen";
import { FullInfoScreen } from "@/Components/full-view/FullInfoScreen";

type ActiveScreen = "home" | "wizard" | "full";

export default function Page() {
  const [screen, setScreen] = useState<ActiveScreen>("home");
  const [selectedFunction, setSelectedFunction] = useState<Funcao | null>(null);

  // Hook responsável por gerenciar estados e animações do Wizard
  const {
    step,
    direction,
    animKey,
    decisions,
    goNext,
    goPrev,
    goToStep,
    setDecision,
    resetWizard,
  } = useWizard(0);

  /**
   * Abre a função selecionada iniciando o Wizard no passo 0
   */
  const handleOpenFunction = (fn: Funcao) => {
    setSelectedFunction(fn);
    resetWizard();
    setScreen("wizard");
  };

  /**
   * Retorna à tela inicial (catálogo)
   */
  const handleBackToHome = () => {
    setScreen("home");
  };

  /**
   * Abre a visualização consolidada de todos os passos
   */
  const handleViewAll = () => {
    setScreen("full");
  };

  /**
   * Retorna da visão completa de volta para o Wizard
   */
  const handleBackToWizard = () => {
    setScreen("wizard");
  };

  return (
    <MobileSafeContainer allowRootScroll={false}>
      {/* 1. Tela Inicial: Catálogo e Busca */}
      {screen === "home" && (
        <HomeScreen onSelectFunction={handleOpenFunction} />
      )}

      {/* 2. Tela do Wizard: Navegação Passo a Passo */}
      {screen === "wizard" && selectedFunction && (
        <WizardScreen
          fn={selectedFunction}
          step={step}
          direction={direction}
          animKey={animKey}
          decisions={decisions}
          onDecide={setDecision}
          onNext={goNext}
          onPrev={goPrev}
          onGoToStep={goToStep}
          onBackToHome={handleBackToHome}
          onViewAll={handleViewAll}
        />
      )}

      {/* 3. Tela de Visão Completa: Todos os Passos em Sequência */}
      {screen === "full" && selectedFunction && (
        <FullInfoScreen
          fn={selectedFunction}
          decisions={decisions}
          onDecide={setDecision}
          onBack={handleBackToWizard}
        />
      )}
    </MobileSafeContainer>
  );
}
