/**
 * @file Components/steps/PessoaItemTable.tsx
 * @description Tabela litúrgica de distribuição de itens em estilo Apple Inset Grouped Table.
 */

"use client";

import React from "react";
import { PessoaItem } from "@/database/schema";

export interface PessoaItemTableProps {
  items: PessoaItem[];
}

export function PessoaItemTable({ items }: PessoaItemTableProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-xs italic text-center py-4 text-[#774f38]/60">
        Nenhum item cadastrado para esta função.
      </p>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-[22px] apple-glass shadow-sm"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.8)",
      }}
    >
      {/* Cabeçalho no padrão iOS Table */}
      <div className="grid grid-cols-2 px-4 py-2.5 bg-[#f1d4af]/70 border-b border-white/60">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#774f38]">
          Pessoa
        </span>
        <span className="text-[11px] font-black uppercase tracking-wider text-[#774f38]">
          Item / Paramento
        </span>
      </div>

      {/* Linhas translúcidas da Tabela */}
      {items.map((row, i) => (
        <div
          key={`${row.pessoa}-${i}`}
          className="grid grid-cols-2 px-4 py-3 items-center transition-colors duration-150"
          style={{
            background: i % 2 === 0 ? "rgba(255, 255, 255, 0.5)" : "rgba(236, 229, 206, 0.4)",
            borderTop: i > 0 ? "1px solid rgba(241, 212, 175, 0.5)" : undefined,
          }}
        >
          <span className="text-[13px] font-extrabold pr-2 text-[#774f38]">
            {row.pessoa}
          </span>
          <span className="text-[13px] font-semibold leading-tight text-[#a0715a]">
            {row.item}
          </span>
        </div>
      ))}
    </div>
  );
}

export default PessoaItemTable;
