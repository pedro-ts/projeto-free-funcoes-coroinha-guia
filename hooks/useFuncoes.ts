/**
 * @file hooks/useFuncoes.ts
 * @description Hook customizado para gerenciamento de busca e filtragem de funções litúrgicas.
 */

"use client";

import { useState, useMemo } from "react";
import { searchAndFilterFuncoes, getAvailableFilters, getAllFuncoes } from "@/database";
import type { Funcao, FiltroCategoria } from "@/database";

export interface UseFuncoesReturn {
  /** Termo de busca textual digitado */
  query: string;
  /** Atualiza o termo de busca */
  setQuery: (q: string) => void;
  /** Limpa o termo de busca */
  clearQuery: () => void;
  /** Chave do filtro atualmente selecionado */
  filtro: string;
  /** Atualiza a categoria do filtro */
  setFiltro: (f: string) => void;
  /** Lista de funções resultantes do filtro e da busca */
  filteredFuncoes: Funcao[];
  /** Contagem de funções resultantes */
  count: number;
  /** Total de funções sem filtros */
  totalCount: number;
  /** Opções de filtros disponíveis */
  filters: FiltroCategoria[];
}

export function useFuncoes(): UseFuncoesReturn {
  const [query, setQuery] = useState<string>("");
  const [filtro, setFiltro] = useState<string>("todas");

  const filters = useMemo(() => getAvailableFilters(), []);
  const allFuncoes = useMemo(() => getAllFuncoes(), []);

  const filteredFuncoes = useMemo(() => {
    return searchAndFilterFuncoes(query, filtro);
  }, [query, filtro]);

  const clearQuery = () => setQuery("");

  return {
    query,
    setQuery,
    clearQuery,
    filtro,
    setFiltro,
    filteredFuncoes,
    count: filteredFuncoes.length,
    totalCount: allFuncoes.length,
    filters,
  };
}
