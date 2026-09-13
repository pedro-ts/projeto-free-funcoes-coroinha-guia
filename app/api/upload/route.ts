/**
 * @file app/api/upload/route.ts
 * @description Next.js App Router Route Handler para upload seguro de imagens via ImgBB API.
 * Encaminha o arquivo multipart/form-data recebido e devolve a URL pública final.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Chave IMGBB_API_KEY não configurada no servidor (.env.local)." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo válido enviado no campo 'file'." },
        { status: 400 }
      );
    }

    // Monta o FormData para encaminhar para a API do ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const res = await fetch(imgbbUrl, {
      method: "POST",
      body: imgbbFormData,
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      const errorMsg = data?.error?.message || "Erro desconhecido ao enviar imagem para o ImgBB.";
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: res.status || 500 }
      );
    }

    // Extrai a URL final pública direta da imagem
    const uploadedUrl = data?.data?.url || data?.data?.display_url;

    if (!uploadedUrl) {
      return NextResponse.json(
        { success: false, error: "Resposta do ImgBB não conteve a URL da imagem." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrl,
    });
  } catch (error: unknown) {
    console.error("Erro interno no upload de imagem:", error);
    const message = error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
