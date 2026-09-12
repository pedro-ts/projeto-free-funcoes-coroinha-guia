import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Servire - Guia de Funções Litúrgicas",
  description: "Guia prático e interativo passo a passo das funções litúrgicas da Igreja.",
  icons: {
    icon: "/logo/logo.png",
    shortcut: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Servire",
  },
};

/**
 * Configuração essencial de Viewport para PWA e navegadores móveis:
 * - viewportFit: "cover" instrui o Safari do iOS e o Chrome a preencherem a tela
 *   completa, ativando os insets de safe area corretos para entalhes e barras flutuantes.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ece5ce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${nunito.className} h-full antialiased`}>
      <body className="h-full w-full overflow-hidden flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
