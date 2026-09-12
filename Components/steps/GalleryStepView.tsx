/**
 * @file Components/steps/GalleryStepView.tsx
 * @description Galeria visual em Apple Liquid Glass com abertura em tela cheia e zoom interativo.
 */

"use client";

import React, { useState } from "react";
import { GaleriaItem } from "@/database/schema";
import { IconImage, IconZoomIn } from "@/Components/ui/AppIcon";
import ImageZoomModal from "./ImageZoomModal";

export interface GalleryStepViewProps {
  gallery: GaleriaItem[];
}

export function GalleryStepView({ gallery }: GalleryStepViewProps) {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm font-semibold text-[#e08e79]">
          Nenhuma imagem na galeria desta função.
        </p>
      </div>
    );
  }

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const openLightbox = (index: number) => {
    if (!failedImages[index]) {
      setSelectedPhotoIndex(index);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((foto, i) => {
          const hasError = failedImages[i];

          return (
            <div
              key={`${foto.link}-${i}`}
              onClick={() => openLightbox(i)}
              className={`rounded-[24px] overflow-hidden apple-glass-card shadow-sm flex flex-col group transition-all duration-300 ${
                !hasError ? "cursor-zoom-in hover:shadow-md hover:-translate-y-0.5" : ""
              }`}
              role={!hasError ? "button" : undefined}
              tabIndex={!hasError ? 0 : undefined}
              onKeyDown={(e) => {
                if (!hasError && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  openLightbox(i);
                }
              }}
              title={!hasError ? "Clique ou toque para ampliar a imagem" : undefined}
              aria-label={foto.titulo || "Foto de referência"}
            >
              {/* Contêiner da Imagem com Feedback de Zoom */}
              <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#f1d4af]/30">
                {hasError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white/40 p-4 text-center text-[#774f38]">
                    <IconImage size={34} strokeWidth={1.6} />
                    <p className="text-xs font-bold mt-2">
                      {foto.titulo || "Referência litúrgica"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={foto.link}
                      alt={foto.titulo || "Foto de referência litúrgica"}
                      onError={() => handleImageError(i)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badge sutil de Zoom no canto da imagem */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center gap-1 text-[11px] font-bold opacity-80 group-hover:opacity-100 transition-opacity shadow-sm">
                      <IconZoomIn size={13} strokeWidth={2.4} />
                      <span className="hidden sm:inline">Ampliar</span>
                    </div>
                  </>
                )}
              </div>

              {/* Legenda em Vidro Líquido */}
              {foto.titulo && (
                <div className="px-4 py-2.5 apple-glass-clear mt-auto flex items-center justify-between">
                  <p className="text-xs font-extrabold text-[#774f38] line-clamp-2">
                    {foto.titulo}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Zoom em Tela Cheia */}
      {selectedPhotoIndex !== null && (
        <ImageZoomModal
          gallery={gallery}
          initialIndex={selectedPhotoIndex}
          isOpen={selectedPhotoIndex !== null}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </>
  );
}

export default GalleryStepView;
