/**
 * @file Components/steps/StepBody.tsx
 * @description Despachante/Roteador do corpo de cada passo litúrgico.
 * 
 * Conecta o índice do passo aos componentes especializados:
 * - 0: Quando sair para preparar
 * - 1: Como fazer (instruções e bifurcações rezada/cantada)
 * - 2: Quando fazer
 * - 3: Relação Pessoa x Item
 * - 4: Galeria de imagens
 */

"use client";

import React from "react";
import { Funcao } from "@/database/schema";
import TextStepView from "./TextStepView";
import DecisionStepView from "./DecisionStepView";
import PessoaItemTable from "./PessoaItemTable";
import GalleryStepView from "./GalleryStepView";

export interface StepBodyProps {
  /** Objeto da função litúrgica em exibição */
  fn: Funcao;
  /** Índice do passo atual (0 a 4) */
  stepIndex: number;
  /** Mapa de decisões selecionadas */
  decisions: Record<string, string>;
  /** Callback para atualizar ou resetar decisões */
  onDecide: (key: string, val: string) => void;
  /** Se deve ser exibido em modo somente leitura (ex: na visão completa) */
  readOnly?: boolean;
}

export function StepBody({
  fn,
  stepIndex,
  decisions,
  onDecide,
  readOnly = false,
}: StepBodyProps) {
  const decisionKey = `${fn.numero}-${stepIndex}`;

  switch (stepIndex) {
    case 0:
      // Passo 0: Quando sair para preparar
      return (
        <TextStepView
          content={fn.conteudo.quando_sair_para_preparar.conteudo}
        />
      );

    case 1:
      // Passo 1: Como fazer (pode conter bifurcação/decisão)
      return (
        <DecisionStepView
          campo={fn.conteudo.como_fazer}
          decisionKey={decisionKey}
          decisions={decisions}
          onDecide={onDecide}
          readOnly={readOnly}
        />
      );

    case 2:
      // Passo 2: Quando fazer
      return (
        <DecisionStepView
          campo={fn.conteudo.quando_fazer}
          decisionKey={decisionKey}
          decisions={decisions}
          onDecide={onDecide}
          readOnly={readOnly}
        />
      );

    case 3:
      // Passo 3: Relação Pessoa x Item
      return <PessoaItemTable items={fn.pessoa_x_item} />;

    case 4:
      // Passo 4: Galeria de fotos
      return <GalleryStepView gallery={fn.galeria} />;

    default:
      return null;
  }
}

export default StepBody;
