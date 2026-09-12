/**
 * @file Components/home/HomeHeader.tsx
 * @description Identidade visual e cabeçalho litúrgico no padrão Apple Liquid Glass.
 * 
 * Substitui o emoji de igreja por um ícone vetorial HugeIcons envolto em uma lente de vidro líquido.
 */

"use client";

import React from "react";
import AppLogo from "@/Components/ui/AppLogo";
import { C } from "@/constants/theme";

export function HomeHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3.5">
        {/* Logo Adaptativa Servire+ */}
        <AppLogo variant="responsive" height={44} priority />

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight" style={{ color: C.marrom }}>
            Liturgia
          </h1>
          <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest" style={{ color: C.salmao }}>
            Guia de Funções
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeHeader;
