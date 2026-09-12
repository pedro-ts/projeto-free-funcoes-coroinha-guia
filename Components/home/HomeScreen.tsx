/**
 * @file Components/home/HomeScreen.tsx
 * @description Tela principal do catálogo litúrgico com cabeçalho 100% de largura (sem formato de card),
 * transição suave para versão compacta ao rolar, e visualização em grade de cards.
 */

"use client";

import React, { useState, useRef } from "react";
import { Funcao } from "@/database/schema";
import { useFuncoes } from "@/hooks/useFuncoes";
import { IconSearch, IconCancel } from "@/Components/ui/AppIcon";
import AppLogo from "@/Components/ui/AppLogo";
import LiquidGlassWrapper from "@/Components/ui/LiquidGlassWrapper";
import HomeHeader from "./HomeHeader";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import FunctionGrid from "./FunctionGrid";
import EmptyState from "./EmptyState";

export interface HomeScreenProps {
  onSelectFunction: (fn: Funcao) => void;
}

export function HomeScreen({ onSelectFunction }: HomeScreenProps) {
  const {
    query,
    setQuery,
    clearQuery,
    filtro,
    setFiltro,
    filteredFuncoes,
    count,
    filters,
  } = useFuncoes();

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Histerese para evitar flicker/oscilação na transição de cabeçalho
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 95 && !isScrolled) {
      setIsScrolled(true);
    } else if (scrollTop < 35 && isScrolled) {
      setIsScrolled(false);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="w-full h-full flex flex-col overflow-y-auto no-scrollbar relative"
    >
      {/*
        ── Cabeçalho Superior 100% de Largura (Header Real, sem formato de card) ──
        Ocupa 100% da largura, sem margens externas e sem bordas arredondadas no topo.
      */}
      <header className="sticky top-0 z-30 w-full flex-shrink-0">
        <LiquidGlassWrapper
          variant="frosted"
          blur={28}
          displacement={8}
          className="w-full rounded-none rounded-b-[26px] border-t-0 border-x-0 border-b border-white/80 shadow-md transition-all duration-300"
        >
          {isScrolled ? (
            /* ── Layout Compacto (Ao rolar a página) ── */
            <div className="w-full max-w-full md:max-w-4xl lg:max-w-6xl mx-auto px-5 py-2.5 flex flex-col gap-2 anim-fade">
              <div className="flex items-center justify-between gap-3">
                {/* Logo Adaptativa + Título Compacto */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <AppLogo variant="full" height={30} priority />
                  <span className="text-[14px] font-black tracking-tight text-[#774f38]">
                    Liturgia
                  </span>
                </div>

                {/* Campo de Busca Rápido Alinhado */}
                <div className="flex-1 max-w-md relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e08e79] pointer-events-none">
                    <IconSearch size={14} strokeWidth={2.4} />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar função..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-8.5 pr-8 py-1.5 rounded-full text-xs font-semibold bg-white/80 text-[#774f38] placeholder-[#774f38]/50 border border-white/80 outline-none focus:bg-white focus:ring-1 focus:ring-[#e08e79]"
                  />
                  {query.length > 0 && (
                    <button
                      type="button"
                      onClick={clearQuery}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#774f38]/15 flex items-center justify-center text-[#774f38]"
                    >
                      <IconCancel size={10} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filtros em Linha Compacta */}
              <FilterTabs
                filters={filters}
                activeFilter={filtro}
                onSelectFilter={setFiltro}
              />
            </div>
          ) : (
            /* ── Layout Expandido Completo (Topo da página) ── */
            <div className="w-full max-w-full md:max-w-4xl lg:max-w-6xl mx-auto px-5 pt-3 pb-3.5 flex flex-col gap-3 anim-fade">
              {/* Identidade / Brasão */}
              <HomeHeader />

              {/* Barra de Busca Completa */}
              <SearchBar
                value={query}
                onChange={setQuery}
                onClear={clearQuery}
              />

              {/* Abas de Filtros */}
              <FilterTabs
                filters={filters}
                activeFilter={filtro}
                onSelectFilter={setFiltro}
              />
            </div>
          )}
        </LiquidGlassWrapper>
      </header>

      {/*
        ── Conteúdo Principal: Grade de Cards Litúrgicos ──
      */}
      <div className="px-5 pt-4 pb-24 flex-1 w-full max-w-full md:max-w-4xl lg:max-w-6xl mx-auto">
        {/* Contador */}
        <p className="text-[11px] font-black uppercase tracking-wider mb-3.5 px-1 text-[#e08e79]">
          {count} {count === 1 ? "função disponível" : "funções disponíveis"}
        </p>

        {/* Grade de Cards ou Estado Vazio */}
        {count > 0 ? (
          <FunctionGrid funcoes={filteredFuncoes} onSelect={onSelectFunction} />
        ) : (
          <EmptyState
            onReset={() => {
              clearQuery();
              setFiltro("todas");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
