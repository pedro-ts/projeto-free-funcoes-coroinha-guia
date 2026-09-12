/**
 * @file Components/home/SearchBar.tsx
 * @description Barra de busca Apple Liquid Glass com ícones HugeIcons vetoriais.
 */

"use client";

import React from "react";
import { IconSearch, IconCancel } from "@/Components/ui/AppIcon";

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Buscar função litúrgica...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      {/* Ícone HugeIcons de Busca */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center justify-center text-[#e08e79]">
        <IconSearch size={18} strokeWidth={2.2} />
      </div>

      {/* Input de Texto Liquid Glass */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 rounded-[20px] text-[14px] font-semibold outline-none transition-all duration-200 apple-glass-clear text-[#774f38] placeholder-[#774f38]/50 focus:border-[#e08e79] focus:ring-2 focus:ring-[#e08e79]/30"
        style={{
          boxShadow: "inset 0 1px 2px rgba(119, 79, 56, 0.06), 0 4px 16px -4px rgba(119, 79, 56, 0.08)",
        }}
      />

      {/* Botão de Limpeza com HugeIcons Cancel */}
      {value.length > 0 && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full apple-glass-control flex items-center justify-center apple-touch text-[#774f38]"
          aria-label="Limpar busca"
        >
          <IconCancel size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
