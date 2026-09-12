/**
 * @file constants/theme.ts
 * @description Constantes visuais, paleta de cores litúrgica e metadados dos passos no padrão Apple HIG.
 */

/**
 * Paleta de cores litúrgicas do Servire
 * Tons quentes, sóbrios e acolhedores perfeitamente integrados aos materiais Liquid Glass.
 */
export const THEME_COLORS = {
  /** Marrom café litúrgico - Tipografia primária, títulos e alto contraste */
  marrom: "#774f38",
  /** Salmão terroso - Ação primária (CTA), seleções ativas e badges em destaque */
  salmao: "#e08e79",
  /** Bege escuro / areia - Bordas, divisórias sutis e fundos secundários */
  begeEscuro: "#f1d4af",
  /** Bege claro / marfim - Fundo principal translúcido e cartões suaves */
  begeClaro: "#ece5ce",
} as const;

/** Alias abreviado de conveniência */
export const C = THEME_COLORS;

/**
 * Metadados de cada um dos passos do Wizard
 */
export interface StepMeta {
  index: number;
  id: "door" | "help" | "clock" | "user" | "camera";
  label: string;
  description: string;
}

export const LITURGICAL_STEPS: StepMeta[] = [
  { index: 0, id: "door", label: "Quando sair?", description: "Horários de saída e antecedência na sacristia" },
  { index: 1, id: "help", label: "Como fazer?", description: "Procedimentos práticos e variações da celebração" },
  { index: 2, id: "clock", label: "Quando fazer?", description: "Momentos e dias da liturgia" },
  { index: 3, id: "user", label: "Itens", description: "Distribuição dos objetos sagrados por servidor" },
  { index: 4, id: "camera", label: "Galeria", description: "Fotos ilustrativas do altar e paramentos" },
];

/** Total de passos disponíveis no Wizard */
export const TOTAL_STEPS = LITURGICAL_STEPS.length;
