/**
 * @file Components/home/EmptyState.tsx
 * @description Estado vazio em material Apple Liquid Glass com HugeIcons vetorial.
 */

"use client";

import React from "react";
import { IconSearch } from "@/Components/ui/AppIcon";

export interface EmptyStateProps {
  onReset?: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Lente Circular de Vidro Líquido com HugeIcon */}
      <div className="w-20 h-20 rounded-[28px] apple-glass flex items-center justify-center mb-4 text-[#e08e79] shadow-md">
        <IconSearch size={36} strokeWidth={1.8} />
      </div>

      <h3 className="font-extrabold text-base text-[#774f38]">
        Nenhuma função encontrada
      </h3>
      <p className="text-xs mt-1.5 max-w-xs font-semibold text-[#e08e79]">
        Tente outro termo ou limpe os filtros para visualizar todas as opções litúrgicas.
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 px-5 py-2.5 rounded-[20px] text-xs font-extrabold apple-glass-control apple-touch text-[#774f38]"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

export default EmptyState;
