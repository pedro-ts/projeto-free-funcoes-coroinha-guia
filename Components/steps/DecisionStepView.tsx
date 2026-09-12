/**
 * @file Components/steps/DecisionStepView.tsx
 * @description Decisões litúrgicas interativas:
 * - Título da decisão selecionada no topo
 * - Botão de trocar decisão posicionado abaixo do título com alto destaque
 */

"use client";

import React from "react";
import { Campo } from "@/database/schema";
import { IconCheck, IconUndo, IconChevronRight } from "@/Components/ui/AppIcon";

export interface DecisionStepViewProps {
  campo: Campo;
  decisionKey: string;
  decisions: Record<string, string>;
  onDecide: (key: string, val: string) => void;
  readOnly?: boolean;
}

export function DecisionStepView({
  campo,
  decisionKey,
  decisions,
  onDecide,
  readOnly = false,
}: DecisionStepViewProps) {
  if (!campo.eh_decisao) {
    return (
      <p
        className="leading-relaxed text-[15px] font-semibold whitespace-pre-line text-[#774f38]"
        style={{ letterSpacing: "-0.01em" }}
      >
        {campo.conteudo}
      </p>
    );
  }

  const chosenTitle = decisions[decisionKey];
  const chosenOption = campo.opcoes.find((o) => o.titulo_opcao === chosenTitle);

  // Nenhuma opção selecionada: exibe a pergunta e as opções
  if (!chosenOption) {
    return (
      <div className="space-y-4">
        <p className="font-extrabold text-base text-center text-[#774f38]">
          {campo.pergunta}
        </p>

        <div className="space-y-3">
          {campo.opcoes.map((opt) => (
            <button
              key={opt.titulo_opcao}
              type="button"
              disabled={readOnly}
              onClick={() => onDecide(decisionKey, opt.titulo_opcao)}
              className="w-full py-4 px-5 rounded-[22px] text-left apple-glass-control apple-touch flex items-center justify-between shadow-sm cursor-pointer"
              style={{
                border: "1px solid rgba(224, 142, 121, 0.4)",
              }}
            >
              <span className="font-extrabold text-[15px] text-[#774f38]">
                {opt.titulo_opcao}
              </span>
              <span className="text-xs font-bold text-[#e08e79] flex items-center gap-1">
                <span>Selecionar</span>
                <IconChevronRight size={14} strokeWidth={2.6} />
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Opção escolhida: Título no TOPO e Botão EMBAIXO
  return (
    <div className="space-y-5">
      {/* Bloco da Decisão: Título no Topo, Botão de Troca Abaixo */}
      <div className="p-4 rounded-[22px] bg-white/80 border border-white/95 shadow-sm flex flex-col gap-3">
        {/* Topo: Título da Decisão */}
        <div>
          <div className="flex items-center gap-1.5 text-[#e08e79] text-[10px] font-black uppercase tracking-wider mb-1">
            <IconCheck size={13} strokeWidth={3} />
            <span>Opção Selecionada</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#774f38] leading-tight">
            {chosenOption.titulo_opcao}
          </h3>
        </div>

        {/* Embaixo: Botão com Grande Destaque para Trocar Decisão */}
        {!readOnly && (
          <div className="pt-1 border-t border-[#774f38]/10">
            <button
              type="button"
              onClick={() => onDecide(decisionKey, "")}
              className="w-full py-2.5 px-4 rounded-full apple-glass-accent apple-touch flex items-center justify-center gap-2 text-white font-black text-xs shadow-md cursor-pointer"
              title="Clique para escolher outra modalidade"
            >
              <IconUndo size={14} strokeWidth={2.4} />
              <span>Trocar Decisão</span>
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo Textual da Decisão Escolhida */}
      <div className="px-1">
        <p
          className="leading-relaxed text-[15px] font-semibold whitespace-pre-line text-[#774f38]"
          style={{ letterSpacing: "-0.01em" }}
        >
          {chosenOption.conteudo}
        </p>
      </div>
    </div>
  );
}

export default DecisionStepView;
