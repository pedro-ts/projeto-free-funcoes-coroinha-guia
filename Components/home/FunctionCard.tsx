/**
 * @file Components/home/FunctionCard.tsx
 * @description Card individual em Apple Liquid Glass com HugeIcons vetoriais.
 */

"use client";

import React, { useState } from "react";
import { Funcao } from "@/database/schema";
import { getFuncaoCapaUrl } from "@/database/repository";
import AppLogo from "@/Components/ui/AppLogo";

export interface FunctionCardProps {
  fn: Funcao;
  onClick: (fn: Funcao) => void;
}

export function FunctionCard({ fn, onClick }: FunctionCardProps) {
  const [imgError, setImgError] = useState(false);
  const capa = getFuncaoCapaUrl(fn);

  return (
    <button
      type="button"
      onClick={() => onClick(fn)}
      className="text-left rounded-[26px] overflow-hidden apple-touch cursor-pointer flex flex-col group apple-glass-card"
    >
      {/* Imagem de Capa */}
      <div className="relative w-full h-32 flex-shrink-0 bg-[#f1d4af]/50 overflow-hidden">
        {capa && !imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={capa}
            alt={fn.nome}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/40 opacity-70">
            <AppLogo variant="icon" height={36} />
          </div>
        )}

        {/* Gradiente sutil inferior na imagem para legibilidade */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

        {/* Badge Numérico em Liquid Glass para ordenação das funções */}
        <div
          className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full apple-glass flex items-center justify-center text-xs font-black text-[#774f38] shadow-sm"
        >
          {fn.numero}
        </div>
      </div>

      {/* Conteúdo Textual */}
      <div className="p-3.5 flex-1 flex flex-col justify-center">
        <h3 className="text-[13px] sm:text-[14px] font-extrabold leading-snug line-clamp-2 text-[#774f38]">
          {fn.nome}
        </h3>
      </div>
    </button>
  );
}

export default FunctionCard;
