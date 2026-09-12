/**
 * @file Components/steps/ImageZoomModal.tsx
 * @description Modal interativo de visualização de imagem em tela cheia com zoom, pan,
 * gestos de pinça no mobile, navegação entre fotos e botão de fechar proeminente e acessível.
 * Utiliza React Portal (document.body) para garantir que ocupe 100% da viewport no PC e Mobile.
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { GaleriaItem } from "@/database/schema";
import {
  IconCancel,
  IconZoomIn,
  IconZoomOut,
  IconReset,
  IconChevronLeft,
  IconChevronRight,
} from "@/Components/ui/AppIcon";

export interface ImageZoomModalProps {
  gallery: GaleriaItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomModal({
  gallery,
  initialIndex,
  isOpen,
  onClose,
}: ImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  // Refs para controle de toque e pinça
  const touchStartDistRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentItem = gallery[currentIndex] || gallery[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sincroniza índice quando initialIndex mudar
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [initialIndex, isOpen]);

  // Reset de zoom ao trocar de imagem
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < gallery.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetZoom();
    }
  }, [currentIndex, gallery.length, resetZoom]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetZoom();
    }
  }, [currentIndex, resetZoom]);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const zoomOut = () => {
    setScale((prev) => {
      const nextScale = Math.max(prev - 0.5, 1);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  // Teclado: Escape, setas e zoom
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-") {
        zoomOut();
      } else if (e.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev, resetZoom]);

  // Trava o scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Double tap / clique duplo para alternar zoom
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.003;
    setScale((prev) => {
      const newScale = Math.min(Math.max(prev + delta, 1), 4);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  // Mouse Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Events (Pinch to zoom + Pan + Swipe to dismiss)
  const handleTouchStart = (e: React.TouchEvent) => {
    const now = Date.now();

    // Detecção de toque duplo (double tap)
    if (e.touches.length === 1 && now - lastTapRef.current < 300) {
      handleDoubleTap(e);
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    if (e.touches.length === 2) {
      // Início do gesto de pinça (pinch)
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      // Pinch to zoom
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchStartDistRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * ratio, 1), 4);
      setScale(newScale);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1) {
      if (scale > 1 && isDragging) {
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchStartDistRef.current = null;
    setIsDragging(false);

    // Se estiver em 1x e fizer swipe para baixo considerável, fecha o modal
    if (scale === 1 && e.changedTouches.length === 1) {
      const deltaY = e.changedTouches[0].clientY - touchStartPosRef.current.y;
      const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartPosRef.current.x);
      if (deltaY > 120 && deltaX < 80) {
        onClose();
      }
    }
  };

  if (!isOpen || !currentItem || !mounted) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de Imagem em Tela Cheia"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
      }}
      className="flex flex-col justify-between overflow-hidden bg-black/95 backdrop-blur-2xl select-none"
    >
      {/* ── 1. CABEÇALHO SUPERIOR COM BOTÃO FECHAR PROEMINENTE ── */}
      <div className="relative z-30 w-full px-4 sm:px-6 pt-4 sm:pt-6 pb-4 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/90 via-black/50 to-transparent flex-shrink-0">
        {/* Título e contador da foto */}
        <div className="max-w-[70%] text-left">
          <p className="text-white/70 text-[11px] font-bold uppercase tracking-wider">
            Foto {currentIndex + 1} de {gallery.length}
          </p>
          <h2 className="text-white font-black text-sm sm:text-lg leading-tight truncate">
            {currentItem.titulo || "Foto de referência litúrgica"}
          </h2>
        </div>

        {/* Botão Fechar em Alto Destaque (Apple HIG) */}
        <button
          type="button"
          onClick={onClose}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-2xl cursor-pointer transition-all"
          title="Fechar imagem (Esc)"
          aria-label="Fechar visualizador de imagem"
        >
          <IconCancel size={24} strokeWidth={2.6} />
        </button>
      </div>

      {/* ── 2. ÁREA CENTRAL DA IMAGEM COM PAN E ZOOM ── */}
      <div
        className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none p-2 sm:p-6"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget && scale === 1) {
            onClose();
          }
        }}
      >
        {/* Setas de navegação nas laterais para múltiplas imagens */}
        {gallery.length > 1 && scale === 1 && (
          <>
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 sm:left-6 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md cursor-pointer transition-transform active:scale-95 shadow-xl"
                title="Imagem anterior"
                aria-label="Imagem anterior"
              >
                <IconChevronLeft size={26} strokeWidth={2.4} />
              </button>
            )}

            {currentIndex < gallery.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 sm:right-6 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md cursor-pointer transition-transform active:scale-95 shadow-xl"
                title="Próxima imagem"
                aria-label="Próxima imagem"
              >
                <IconChevronRight size={26} strokeWidth={2.4} />
              </button>
            )}
          </>
        )}

        {/* Imagem Ampliável */}
        <div
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
          className="w-full h-full flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentItem.link}
            alt={currentItem.titulo || "Foto ampliada"}
            className="max-w-[92vw] max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-2xl pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      {/* ── 3. BARRA DE FERRAMENTAS FLUTUANTE INFERIOR ── */}
      <div className="relative z-30 w-full px-4 pb-6 pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-auto flex-shrink-0">
        {/* Controles de Zoom em Apple Glass */}
        <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-2xl shadow-2xl text-white">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 1}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-white/20 active:scale-90 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Reduzir zoom (-)"
            aria-label="Reduzir zoom"
          >
            <IconZoomOut size={20} strokeWidth={2.4} />
          </button>

          {/* Porcentagem / Botão Reset */}
          <button
            type="button"
            onClick={resetZoom}
            className="px-3 py-1 rounded-full hover:bg-white/20 active:scale-95 text-xs sm:text-sm font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            title="Ajustar zoom à tela (100%)"
          >
            <span>{Math.round(scale * 100)}%</span>
            {scale !== 1 && <IconReset size={14} strokeWidth={2.4} />}
          </button>

          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 4}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-white/20 active:scale-90 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Aumentar zoom (+)"
            aria-label="Aumentar zoom"
          >
            <IconZoomIn size={20} strokeWidth={2.4} />
          </button>
        </div>

        {/* Botão Fechar Inferior para facilidade de toque no mobile com uma mão */}
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-full bg-white/25 hover:bg-white/35 active:scale-95 text-white font-extrabold text-xs tracking-wide backdrop-blur-xl border border-white/30 shadow-lg cursor-pointer sm:hidden"
        >
          Fechar
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ImageZoomModal;
