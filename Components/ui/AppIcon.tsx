/**
 * @file Components/ui/AppIcon.tsx
 * @description Sistema unificado de ícones vetoriais baseado em HugeIcons para design Apple HIG.
 * 
 * Substitui todos os emojis por ícones SVG vetoriais nítidos, com proporções
 * equilibradas, espessura ajustável e alinhamento milimétrico.
 */

"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChurchIcon,
  Search01Icon,
  SparklesIcon,
  Sun02Icon,
  StarIcon,
  Door01Icon,
  HelpCircleIcon,
  Clock01Icon,
  UserIcon,
  Camera01Icon,
  Image01Icon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft02Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Undo02Icon,
  Layers01Icon,
  GridViewIcon,
  Menu01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

/** Ícone de Início / Home */
export function IconHome({ size = 18, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Home01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Ícone de Visualização em Grade (Cards) */
export function IconGridView({ size = 18, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={GridViewIcon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Ícone de Visualização em Lista (Modo App) */
export function IconListView({ size = 18, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Menu01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Ícone de Igreja / Liturgia */
export function IconChurch({ size = 22, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={ChurchIcon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Ícone de Busca */
export function IconSearch({ size = 20, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Search01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Ícone de Santíssimo / Brilho / Glória */
export function IconSparkles({ size = 18, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={SparklesIcon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Ícone de Domingo / Sol */
export function IconSun({ size = 18, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Sun02Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Ícone de Especial / Estrela */
export function IconStar({ size = 18, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={StarIcon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Ícone de Todas as Funções / Camadas */
export function IconLayers({ size = 18, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Layers01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Passo 0: Porta / Quando sair? */
export function IconDoor({ size = 22, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Door01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Passo 1: Pergunta / Como fazer? */
export function IconHelp({ size = 22, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={HelpCircleIcon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Passo 2: Relógio / Quando fazer? */
export function IconClock({ size = 22, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Clock01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Passo 3: Usuário / Itens da equipe */
export function IconUser({ size = 22, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={UserIcon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Passo 4: Câmera / Galeria de fotos */
export function IconCamera({ size = 22, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Camera01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Imagem / Fallback */
export function IconImage({ size = 22, color = "currentColor", className = "", strokeWidth = 1.8 }: IconProps) {
  return <HugeiconsIcon icon={Image01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Seta Navegação Esquerda */
export function IconChevronLeft({ size = 22, color = "currentColor", className = "", strokeWidth = 2.2 }: IconProps) {
  return <HugeiconsIcon icon={ChevronLeft} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Seta Navegação Direita */
export function IconChevronRight({ size = 22, color = "currentColor", className = "", strokeWidth = 2.2 }: IconProps) {
  return <HugeiconsIcon icon={ChevronRight} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Seta Voltar */
export function IconArrowBack({ size = 20, color = "currentColor", className = "", strokeWidth = 2 }: IconProps) {
  return <HugeiconsIcon icon={ArrowLeft02Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Cancelar / Fechar / Limpar */
export function IconCancel({ size = 16, color = "currentColor", className = "", strokeWidth = 2 }: IconProps) {
  return <HugeiconsIcon icon={Cancel01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Concluído / Checkmark */
export function IconCheck({ size = 18, color = "currentColor", className = "", strokeWidth = 2 }: IconProps) {
  return <HugeiconsIcon icon={CheckmarkCircle01Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Desfazer / Trocar Escolha */
export function IconUndo({ size = 16, color = "currentColor", className = "", strokeWidth = 2 }: IconProps) {
  return <HugeiconsIcon icon={Undo02Icon} size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

/** Zoom In / Ampliar */
export function IconZoomIn({ size = 20, color = "currentColor", className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

/** Zoom Out / Reduzir */
export function IconZoomOut({ size = 20, color = "currentColor", className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

/** Reset / Ajustar à Tela */
export function IconReset({ size = 18, color = "currentColor", className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

/**
 * Retorna o componente de ícone correspondente ao índice do passo litúrgico
 * @param stepIndex Índice do passo (0 a 4)
 */
export function StepLiturgicalIcon({
  stepIndex,
  size = 20,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}: {
  stepIndex: number;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}) {
  switch (stepIndex) {
    case 0:
      return <IconDoor size={size} color={color} className={className} strokeWidth={strokeWidth} />;
    case 1:
      return <IconHelp size={size} color={color} className={className} strokeWidth={strokeWidth} />;
    case 2:
      return <IconClock size={size} color={color} className={className} strokeWidth={strokeWidth} />;
    case 3:
      return <IconUser size={size} color={color} className={className} strokeWidth={strokeWidth} />;
    case 4:
      return <IconCamera size={size} color={color} className={className} strokeWidth={strokeWidth} />;
    default:
      return <IconChurch size={size} color={color} className={className} strokeWidth={strokeWidth} />;
  }
}

/**
 * Retorna o componente de ícone correspondente à chave do filtro
 */
export function FilterCategoryIcon({
  filterKey,
  size = 14,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}: {
  filterKey: string;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}) {
  switch (filterKey) {
    case "com santissimo":
      return <IconSparkles size={size} color={color} className={className} strokeWidth={strokeWidth} />;
    case "domingo":
      return <IconSun size={size} color={color} className={className} strokeWidth={strokeWidth} />;
    case "especial":
      return <IconStar size={size} color={color} className={className} strokeWidth={strokeWidth} />;
    case "todas":
    default:
      return <IconLayers size={size} color={color} className={className} strokeWidth={strokeWidth} />;
  }
}
