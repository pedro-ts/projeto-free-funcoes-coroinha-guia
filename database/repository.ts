/**
 * @file database/repository.ts
 * @description Repositório de acesso aos dados do Servire (Padrão Repository).
 * 
 * Esta camada simula as operações de banco de dados do aplicativo.
 * Todas as consultas (listagem, busca por texto, filtro de categorias e busca por ID)
 * passam por estas funções puras e tipadas.
 * 
 * Se no futuro o app for conectado ao Supabase, SQLite, PostgreSQL ou Firebase,
 * apenas as funções deste repositório precisarão ser atualizadas, sem tocar
 * em nenhum componente de interface de usuário.
 */

import rawData from "./funcoes.json";
import { Funcao, FiltroCategoria } from "./schema";

/** Conjunto de dados base (tabela de funções) */
const FUNCOES_DB: Funcao[] = rawData as Funcao[];

/**
 * Retorna todas as funções litúrgicas cadastradas no banco de dados.
 */
export function getAllFuncoes(): Funcao[] {
  return FUNCOES_DB;
}

/**
 * Busca uma função litúrgica específica pelo seu número identificador.
 * @param numero Número da função litúrgica
 * @returns A função encontrada ou undefined caso não exista
 */
export function getFuncaoByNumero(numero: number): Funcao | undefined {
  return FUNCOES_DB.find((fn) => fn.numero === numero);
}

/**
 * Retorna a URL da imagem de capa de uma função.
 * Prioriza o campo dedicado `imagem_capa`; caso não esteja definido ou esteja vazio,
 * utiliza a primeira foto da galeria como fallback.
 * @param fn Função litúrgica
 */
export function getFuncaoCapaUrl(fn: Funcao): string {
  if (fn.imagem_capa && fn.imagem_capa.trim() !== "") {
    return fn.imagem_capa;
  }
  return fn.galeria && fn.galeria.length > 0 ? fn.galeria[0].link : "";
}

/**
 * Filtra e busca funções com base em um termo de pesquisa e numa categoria.
 * @param query Texto digitado na barra de busca (case-insensitive)
 * @param filtro Chave do filtro selecionado ('todas', 'com santissimo', 'domingo', 'especial')
 */
export function searchAndFilterFuncoes(query: string, filtro: string): Funcao[] {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedFilter = filtro.trim().toLowerCase();

  return FUNCOES_DB.filter((fn) => {
    // Validação de texto (busca no nome da função)
    const matchQuery =
      normalizedQuery === "" ||
      fn.nome.toLowerCase().includes(normalizedQuery);

    // Validação de categoria/filtro
    const matchFilter =
      normalizedFilter === "todas" ||
      fn.missas_presentes.some((tag) => tag.toLowerCase() === normalizedFilter);

    return matchQuery && matchFilter;
  });
}

/**
 * Lista os filtros pré-configurados para a barra de navegação da tela inicial.
 */
export function getAvailableFilters(): FiltroCategoria[] {
  return [
    { key: "todas", label: "Todas" },
    { key: "com santissimo", label: "Com Santíssimo" },
    { key: "domingo", label: "Domingo" },
    { key: "especial", label: "Especial" },
  ];
}

/**
 * Retorna a contagem total de registros no banco de dados.
 */
export function getTotalFuncoesCount(): number {
  return FUNCOES_DB.length;
}
