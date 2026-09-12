/**
 * @file Components/ui/AppLogo.tsx
 * @description Componente adaptativo de Logo para o Servire+.
 * Suporta a versão somente ícone (/logo/logo.png) e a versão completa com nome (/logo/logo_e_nome.png),
 * além de modo responsivo automático.
 */

"use client";

import React from "react";
import Image from "next/image";

export interface AppLogoProps {
  /**
   * - "icon": Apenas o brasão/ícone (/logo/logo.png)
   * - "full": Logo com o nome (/logo/logo_e_nome.png)
   * - "responsive": Exibe o ícone em telas muito compactas e a logo completa quando há espaço
   */
  variant?: "icon" | "full" | "responsive";
  /** Altura desejada em pixels (default: 36) */
  height?: number;
  /** Classes adicionais para customização de estilo */
  className?: string;
  /** Prioridade no carregamento de imagem */
  priority?: boolean;
  /** Texto alternativo para acessibilidade */
  alt?: string;
}

export function AppLogo({
  variant = "responsive",
  height = 36,
  className = "",
  priority = true,
  alt = "Servire+ Liturgia",
}: AppLogoProps) {
  if (variant === "icon") {
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ height, width: height }}
      >
        <Image
          src="/logo/logo.png"
          alt={alt}
          width={height}
          height={height}
          priority={priority}
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>
    );
  }

  if (variant === "full") {
    // Proporção de logo_e_nome é 2:1 (2000x1000)
    const calculatedWidth = height * 2;
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ height, width: calculatedWidth }}
      >
        <Image
          src="/logo/logo_e_nome.png"
          alt={alt}
          width={calculatedWidth}
          height={height}
          priority={priority}
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>
    );
  }

  // Variant "responsive": Icon no mobile compacto, Full a partir de sm (ou quando couber)
  const fullWidth = height * 2;

  return (
    <div className={`relative inline-flex items-center flex-shrink-0 ${className}`}>
      {/* Somente Ícone para telas pequenas */}
      <div
        className="block sm:hidden relative flex-shrink-0"
        style={{ height, width: height }}
      >
        <Image
          src="/logo/logo.png"
          alt={alt}
          width={height}
          height={height}
          priority={priority}
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      {/* Logo com Nome para telas maiores */}
      <div
        className="hidden sm:block relative flex-shrink-0"
        style={{ height, width: fullWidth }}
      >
        <Image
          src="/logo/logo_e_nome.png"
          alt={alt}
          width={fullWidth}
          height={height}
          priority={priority}
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>
    </div>
  );
}

export default AppLogo;
