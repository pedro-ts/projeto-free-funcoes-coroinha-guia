/**
 * @file hooks/useSafeViewport.ts
 * @description Hook utilitário para garantir cálculo perfeito de altura de viewport
 * em navegadores móveis (Safari no iOS e Chrome no Android).
 * 
 * Atualiza dinamicamente uma variável CSS customizada (--safe-vh) e detecta
 * variações no redimensionamento da barra de endereços do navegador móvel.
 */

"use client";

import { useEffect } from "react";

export function useSafeViewport(): void {
  useEffect(() => {
    function updateHeight() {
      // Calcula a altura interna real visível sem a barra do navegador
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--safe-vh", `${vh}px`);
    }

    // Executa no carregamento inicial
    updateHeight();

    // Registra ouvintes para rotação de tela e redimensionamento dinâmico
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);
}
