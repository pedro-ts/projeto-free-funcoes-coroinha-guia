/**
 * @file Components/home/FunctionGrid.tsx
 * @description Grade de 2 colunas para exibição dos cards de funções litúrgicas.
 */

"use client";

import React from "react";
import { Funcao } from "@/database/schema";
import FunctionCard from "./FunctionCard";

export interface FunctionGridProps {
  /** Lista de funções filtradas */
  funcoes: Funcao[];
  /** Callback ao selecionar uma função */
  onSelect: (fn: Funcao) => void;
}

export function FunctionGrid({ funcoes, onSelect }: FunctionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-5">
      {funcoes.map((fn) => (
        <FunctionCard key={fn.numero} fn={fn} onClick={onSelect} />
      ))}
    </div>
  );
}

export default FunctionGrid;
