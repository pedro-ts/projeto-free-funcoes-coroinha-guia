/**
 * @file Components/steps/TextStepView.tsx
 * @description Renderizador de texto litúrgico no padrão tipográfico Apple HIG.
 */

"use client";

import React from "react";

export interface TextStepViewProps {
  content: string;
}

export function TextStepView({ content }: TextStepViewProps) {
  return (
    <div className="py-1">
      <p
        className="leading-relaxed text-[15px] font-semibold whitespace-pre-line text-[#774f38] antialiased"
        style={{ letterSpacing: "-0.01em" }}
      >
        {content}
      </p>
    </div>
  );
}

export default TextStepView;
