/**
 * @file app/adm/page.tsx
 * @description Painel Administrativo do Servire para criação interativa de funções litúrgicas,
 * upload automático de imagens via ImgBB e exportação/download de JSON pronto para o banco de dados.
 */

"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  IconArrowBack,
  IconPlus,
  IconTrash,
  IconUpload,
  IconDownload,
  IconCopy,
  IconCheck,
  IconCancel,
  IconImage,
  IconCode,
  IconHelp,
  IconDoor,
  IconClock,
  IconUser,
  IconCamera,
} from "@/Components/ui/AppIcon";
import AppLogo from "@/Components/ui/AppLogo";
import LiquidGlassWrapper from "@/Components/ui/LiquidGlassWrapper";

// Tipagens do Contrato
export interface OpcaoDecisaoForm {
  titulo_opcao: string;
  conteudo: string;
}

export interface ConteudoItemForm {
  eh_decisao: boolean;
  conteudo: string;
  pergunta: string;
  opcoes: OpcaoDecisaoForm[];
}

export interface PessoaItemForm {
  pessoa: string;
  item: string;
}

export interface GaleriaItemForm {
  id: string;
  titulo: string;
  file: File | null;
  previewUrl: string;
}

export interface FuncaoLiturgicaJSONFinal {
  nome: string;
  numero: number;
  imagem_capa?: string;
  missas_presentes: string[];
  conteudo: {
    quando_sair_para_preparar: {
      eh_decisao: boolean;
      conteudo?: string;
      pergunta?: string;
      opcoes?: { titulo_opcao: string; conteudo: string }[];
    };
    como_fazer: {
      eh_decisao: boolean;
      conteudo?: string;
      pergunta?: string;
      opcoes?: { titulo_opcao: string; conteudo: string }[];
    };
    quando_fazer: {
      eh_decisao: boolean;
      conteudo?: string;
      pergunta?: string;
      opcoes?: { titulo_opcao: string; conteudo: string }[];
    };
  };
  pessoa_x_item: { pessoa: string; item: string }[];
  galeria: { titulo: string; link: string }[];
}

export default function AdminPage() {
  // Estado básico
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState<number | "">("");
  const [missasPresentes, setMissasPresentes] = useState<string[]>([
    "domingo",
    "com santissimo",
  ]);
  const [novaTag, setNovaTag] = useState("");

  // Estado de Imagem de Capa
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string>("");
  const [capaUrlExterna, setCapaUrlExterna] = useState<string>("");

  // Estado do Conteúdo
  const [quandoSair, setQuandoSair] = useState<ConteudoItemForm>({
    eh_decisao: false,
    conteudo: "",
    pergunta: "",
    opcoes: [{ titulo_opcao: "", conteudo: "" }],
  });

  const [comoFazer, setComoFazer] = useState<ConteudoItemForm>({
    eh_decisao: false,
    conteudo: "",
    pergunta: "",
    opcoes: [{ titulo_opcao: "", conteudo: "" }],
  });

  const [quandoFazer, setQuandoFazer] = useState<ConteudoItemForm>({
    eh_decisao: false,
    conteudo: "",
    pergunta: "",
    opcoes: [{ titulo_opcao: "", conteudo: "" }],
  });

  // Estado de Pessoa x Item
  const [pessoaXItem, setPessoaXItem] = useState<PessoaItemForm[]>([
    { pessoa: "Acólito", item: "" },
  ]);

  // Estado da Galeria
  const [galeria, setGaleria] = useState<GaleriaItemForm[]>([]);

  // Estados de Operação / Processamento
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [finalJsonResult, setFinalJsonResult] = useState<FuncaoLiturgicaJSONFinal | null>(null);
  const [copied, setCopied] = useState(false);

  // --- Handlers de Tags ---
  const handleAddTag = () => {
    const trimmed = novaTag.trim().toLowerCase();
    if (trimmed && !missasPresentes.includes(trimmed)) {
      setMissasPresentes([...missasPresentes, trimmed]);
      setNovaTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMissasPresentes(missasPresentes.filter((t) => t !== tagToRemove));
  };

  // --- Handlers de Capa ---
  const handleCapaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapaFile(file);
      setCapaPreview(URL.createObjectURL(file));
      setCapaUrlExterna("");
    }
  };

  const handleRemoveCapa = () => {
    setCapaFile(null);
    setCapaPreview("");
    setCapaUrlExterna("");
  };

  // --- Handlers de Galeria ---
  const handleAddGaleriaItem = () => {
    const newItem: GaleriaItemForm = {
      id: Math.random().toString(36).substring(2, 9),
      titulo: "",
      file: null,
      previewUrl: "",
    };
    setGaleria([...galeria, newItem]);
  };

  const handleRemoveGaleriaItem = (id: string) => {
    setGaleria(galeria.filter((g) => g.id !== id));
  };

  const handleGaleriaFileChange = (id: string, file: File | null) => {
    setGaleria((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const previewUrl = file ? URL.createObjectURL(file) : "";
          return { ...item, file, previewUrl };
        }
        return item;
      })
    );
  };

  const handleGaleriaTituloChange = (id: string, titulo: string) => {
    setGaleria((prev) =>
      prev.map((item) => (item.id === id ? { ...item, titulo } : item))
    );
  };

  // --- Handlers de Pessoa x Item ---
  const handleAddPessoaItem = () => {
    setPessoaXItem([...pessoaXItem, { pessoa: "", item: "" }]);
  };

  const handleRemovePessoaItem = (index: number) => {
    setPessoaXItem(pessoaXItem.filter((_, i) => i !== index));
  };

  const handlePessoaItemChange = (index: number, field: "pessoa" | "item", val: string) => {
    setPessoaXItem((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  // --- Funções Auxiliares de Upload ---
  const uploadSingleImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Erro ao enviar ${file.name}`);
    }

    return data.url;
  };

  // Sanitizador de Conteúdo para o JSON
  const formatConteudoItem = (item: ConteudoItemForm) => {
    if (item.eh_decisao) {
      return {
        eh_decisao: true as const,
        pergunta: item.pergunta.trim(),
        opcoes: item.opcoes.map((op) => ({
          titulo_opcao: op.titulo_opcao.trim(),
          conteudo: op.conteudo.trim(),
        })),
      };
    }
    return {
      eh_decisao: false as const,
      conteudo: item.conteudo.trim(),
    };
  };

  // --- Submissão Principal ---
  const handleGerarObjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!nome.trim()) {
      setErrorMessage("Por favor, preencha o Nome da Função.");
      return;
    }

    if (numero === "" || Number(numero) <= 0) {
      setErrorMessage("Por favor, informe um Número de Função válido.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage("Preparando e validando dados...");

      // 1. Upload da Capa (se houver arquivo local)
      let finalCapaUrl = capaUrlExterna.trim();
      if (capaFile) {
        setStatusMessage("Enviando imagem de capa para o ImgBB...");
        finalCapaUrl = await uploadSingleImage(capaFile);
      }

      // 2. Upload paralelo das fotos da galeria
      const finalGaleria: { titulo: string; link: string }[] = [];
      const filesToUpload = galeria.filter((g) => g.file !== null);

      if (filesToUpload.length > 0) {
        setStatusMessage(`Enviando ${filesToUpload.length} imagem(ns) da galeria...`);

        const uploadPromises = galeria.map(async (item) => {
          if (item.file) {
            const uploadedUrl = await uploadSingleImage(item.file);
            return {
              titulo: item.titulo.trim() || "Foto de referência",
              link: uploadedUrl,
            };
          }
          return null;
        });

        const uploadedResults = await Promise.all(uploadPromises);
        for (const res of uploadedResults) {
          if (res) finalGaleria.push(res);
        }
      }

      setStatusMessage("Estruturando o objeto JSON final...");

      // 3. Monta o Objeto Final com o Schema Estrito
      const objetoFinal: FuncaoLiturgicaJSONFinal = {
        nome: nome.trim(),
        numero: Number(numero),
        imagem_capa: finalCapaUrl || undefined,
        missas_presentes: missasPresentes,
        conteudo: {
          quando_sair_para_preparar: formatConteudoItem(quandoSair),
          como_fazer: formatConteudoItem(comoFazer),
          quando_fazer: formatConteudoItem(quandoFazer),
        },
        pessoa_x_item: pessoaXItem
          .filter((p) => p.pessoa.trim() || p.item.trim())
          .map((p) => ({
            pessoa: p.pessoa.trim(),
            item: p.item.trim(),
          })),
        galeria: finalGaleria,
      };

      setFinalJsonResult(objetoFinal);

      // 4. Dispara o download automático do JSON
      const sanitizedName = nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const fileName = `funcao-${numero}-${sanitizedName || "objeto"}.json`;
      const blob = new Blob([JSON.stringify(objetoFinal, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setStatusMessage("Concluído! Objeto gerado e download iniciado.");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Falha ao processar o formulário.";
      setErrorMessage(`Erro: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyJson = async () => {
    if (!finalJsonResult) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(finalJsonResult, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Renderizador de Seção de Conteúdo com Switch Decisão/Texto
  const renderConteudoEditor = (
    titulo: string,
    icone: React.ReactNode,
    state: ConteudoItemForm,
    setState: React.Dispatch<React.SetStateAction<ConteudoItemForm>>
  ) => {
    return (
      <div className="p-4 sm:p-5 rounded-[22px] bg-white/70 border border-white/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[#774f38]">
            {icone}
            <h3 className="text-sm font-extrabold">{titulo}</h3>
          </div>

          {/* Switch É Decisão? */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#774f38]">
            <input
              type="checkbox"
              checked={state.eh_decisao}
              onChange={(e) =>
                setState({
                  ...state,
                  eh_decisao: e.target.checked,
                })
              }
              className="w-4 h-4 rounded text-[#e08e79] focus:ring-[#e08e79] cursor-pointer"
            />
            <span>É uma decisão / ramificação?</span>
          </label>
        </div>

        {!state.eh_decisao ? (
          <div>
            <label className="block text-xs font-bold text-[#774f38]/80 mb-1">
              Instruções / Conteúdo
            </label>
            <textarea
              rows={4}
              value={state.conteudo}
              onChange={(e) => setState({ ...state, conteudo: e.target.value })}
              placeholder="Digite o passo a passo detalhado..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ece5ce] bg-white/90 text-[#774f38] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#e08e79]/50 placeholder:text-[#774f38]/40 resize-y"
            />
          </div>
        ) : (
          <div className="space-y-3 bg-[#f1d4af]/20 p-3.5 rounded-xl border border-[#f1d4af]/40">
            <div>
              <label className="block text-xs font-bold text-[#774f38] mb-1">
                Pergunta da Decisão
              </label>
              <input
                type="text"
                value={state.pergunta}
                onChange={(e) => setState({ ...state, pergunta: e.target.value })}
                placeholder="Ex: Como será a missa? / Qual cadeira você irá assumir?"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ece5ce] bg-white text-[#774f38] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#e08e79]/50 font-bold"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#774f38]">
                Opções da Decisão
              </label>

              {state.opcoes.map((opcao, opIdx) => (
                <div
                  key={opIdx}
                  className="p-3 bg-white rounded-xl border border-[#ece5ce] shadow-xs space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={opcao.titulo_opcao}
                      onChange={(e) => {
                        const newOpcoes = [...state.opcoes];
                        newOpcoes[opIdx].titulo_opcao = e.target.value;
                        setState({ ...state, opcoes: newOpcoes });
                      }}
                      placeholder={`Título da Opção ${opIdx + 1} (ex: Missa Normal, Missa com Santíssimo)`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#ece5ce] text-xs sm:text-sm font-extrabold text-[#774f38] focus:outline-none focus:ring-2 focus:ring-[#e08e79]/50"
                    />

                    {state.opcoes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newOpcoes = state.opcoes.filter((_, i) => i !== opIdx);
                          setState({ ...state, opcoes: newOpcoes });
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Remover opção"
                      >
                        <IconTrash size={16} />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    value={opcao.conteudo}
                    onChange={(e) => {
                      const newOpcoes = [...state.opcoes];
                      newOpcoes[opIdx].conteudo = e.target.value;
                      setState({ ...state, opcoes: newOpcoes });
                    }}
                    placeholder="Instruções para quando esta opção for escolhida..."
                    className="w-full px-3 py-2 rounded-lg border border-[#ece5ce] text-xs sm:text-sm text-[#774f38] focus:outline-none focus:ring-2 focus:ring-[#e08e79]/50 placeholder:text-[#774f38]/40 resize-y"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setState({
                    ...state,
                    opcoes: [...state.opcoes, { titulo_opcao: "", conteudo: "" }],
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#f1d4af]/60 hover:bg-[#f1d4af] text-[#774f38] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <IconPlus size={14} />
                <span>Adicionar Opção de Decisão</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#ece5ce] text-[#774f38] font-sans antialiased overflow-y-auto">
      {/* Barra de Topo */}
      <header className="sticky top-0 z-40 w-full border-b border-white/80 bg-[#ece5ce]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-full bg-white/90 text-[#774f38] hover:bg-white border border-white/90 apple-touch shadow-xs cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <IconArrowBack size={16} />
              <span className="hidden sm:inline">Voltar ao App</span>
            </Link>
            <div className="flex items-center gap-2">
              <AppLogo variant="icon" height={26} />
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#774f38]">
                Gerador de JSON Administrativo
              </span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#f1d4af] text-[#774f38] text-xs font-black">
            Painel /adm
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#774f38]">
            Cadastrar Nova Função Litúrgica
          </h1>
          <p className="text-xs sm:text-sm text-[#774f38]/80 mt-1 font-medium">
            Preencha os campos abaixo, selecione as fotos do seu computador e gere o objeto formatado com upload automático das fotos no ImgBB.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
            <IconCancel size={18} className="flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">Atenção</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {statusMessage && isProcessing && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-3 animate-pulse">
            <div className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
            <span className="font-bold">{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleGerarObjeto} className="space-y-6">
          {/* SEÇÃO 1: Dados Básicos */}
          <div className="p-5 rounded-[26px] apple-glass-card shadow-xs space-y-4">
            <h2 className="text-base font-black text-[#774f38] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#774f38] text-[#ece5ce] flex items-center justify-center text-xs">
                1
              </span>
              Identificação da Função
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#774f38] mb-1">
                  Nome da Função *
                </label>
                <input
                  type="text"
                  required
                  disabled={isProcessing}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Turíbulo e Naveta, Sino, Lavabo..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ece5ce] bg-white text-[#774f38] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#e08e79]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#774f38] mb-1">
                  Número / Ordem *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  disabled={isProcessing}
                  value={numero}
                  onChange={(e) => setNumero(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Ex: 14"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ece5ce] bg-white text-[#774f38] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#e08e79]"
                />
              </div>
            </div>

            {/* Imagem de Capa Principal */}
            <div>
              <label className="block text-xs font-bold text-[#774f38] mb-1">
                Imagem de Capa (Opcional - Enviar Arquivo ou Inserir URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-[#ece5ce] hover:bg-[#f1d4af]/30 text-xs font-bold text-[#774f38] flex items-center gap-2 transition-colors">
                  <IconUpload size={16} />
                  <span>Escolher Foto de Capa</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isProcessing}
                    onChange={handleCapaFileChange}
                    className="hidden"
                  />
                </label>

                <span className="text-xs text-[#774f38]/60 font-semibold">ou</span>

                <input
                  type="url"
                  disabled={isProcessing || capaFile !== null}
                  value={capaUrlExterna}
                  onChange={(e) => setCapaUrlExterna(e.target.value)}
                  placeholder="URL externa (https://...)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#ece5ce] bg-white text-[#774f38] text-xs focus:outline-none focus:ring-2 focus:ring-[#e08e79]"
                />

                {(capaPreview || capaUrlExterna) && (
                  <button
                    type="button"
                    onClick={handleRemoveCapa}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Remover capa"
                  >
                    <IconTrash size={16} />
                  </button>
                )}
              </div>

              {/* Preview da Capa */}
              {(capaPreview || capaUrlExterna) && (
                <div className="mt-3 relative w-24 h-24 rounded-xl overflow-hidden border border-white/80 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capaPreview || capaUrlExterna}
                    alt="Preview capa"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Tags / Missas Presentes */}
            <div>
              <label className="block text-xs font-bold text-[#774f38] mb-1.5">
                Missas Presentes (Tags de Filtro)
              </label>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {missasPresentes.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#f1d4af] text-[#774f38] text-xs font-black flex items-center gap-1.5 shadow-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <IconCancel size={12} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  disabled={isProcessing}
                  value={novaTag}
                  onChange={(e) => setNovaTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Nova tag (ex: especial, santissimo, semana santa)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#ece5ce] bg-white text-[#774f38] text-xs focus:outline-none focus:ring-2 focus:ring-[#e08e79]"
                />
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleAddTag}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#ece5ce] hover:bg-[#f1d4af]/40 text-xs font-bold text-[#774f38] cursor-pointer"
                >
                  Adicionar Tag
                </button>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: Conteúdo Litúrgico */}
          <div className="p-5 rounded-[26px] apple-glass-card shadow-xs space-y-4">
            <h2 className="text-base font-black text-[#774f38] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#774f38] text-[#ece5ce] flex items-center justify-center text-xs">
                2
              </span>
              Conteúdo das Etapas Litúrgicas
            </h2>

            {renderConteudoEditor(
              "Passo 0: Quando Sair para Preparar",
              <IconDoor size={18} />,
              quandoSair,
              setQuandoSair
            )}

            {renderConteudoEditor(
              "Passo 1: Como Fazer",
              <IconHelp size={18} />,
              comoFazer,
              setComoFazer
            )}

            {renderConteudoEditor(
              "Passo 2: Quando Fazer",
              <IconClock size={18} />,
              quandoFazer,
              setQuandoFazer
            )}
          </div>

          {/* SEÇÃO 3: Relação Pessoa x Item */}
          <div className="p-5 rounded-[26px] apple-glass-card shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-[#774f38] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#774f38] text-[#ece5ce] flex items-center justify-center text-xs">
                  3
                </span>
                Relação Pessoa x Item / Paramento
              </h2>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleAddPessoaItem}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f1d4af]/50 border border-[#ece5ce] text-xs font-extrabold text-[#774f38] flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <IconPlus size={14} />
                <span>Adicionar Linha</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {pessoaXItem.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-white/70 rounded-xl border border-white/90 shadow-xs"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={row.pessoa}
                      onChange={(e) => handlePessoaItemChange(idx, "pessoa", e.target.value)}
                      placeholder="Pessoa / Função (ex: Acólito, 2 Coroinhas)"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#ece5ce] bg-white text-xs sm:text-sm font-bold text-[#774f38] focus:outline-none focus:ring-2 focus:ring-[#e08e79]"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={row.item}
                      onChange={(e) => handlePessoaItemChange(idx, "item", e.target.value)}
                      placeholder="Item / Paramento (ex: Turíbulo, Naveta, Cálice)"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#ece5ce] bg-white text-xs sm:text-sm font-bold text-[#774f38] focus:outline-none focus:ring-2 focus:ring-[#e08e79]"
                    />
                  </div>

                  {pessoaXItem.length > 1 && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleRemovePessoaItem(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Remover linha"
                    >
                      <IconTrash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO 4: Galeria de Imagens com Upload */}
          <div className="p-5 rounded-[26px] apple-glass-card shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-black text-[#774f38] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#774f38] text-[#ece5ce] flex items-center justify-center text-xs">
                  4
                </span>
                Galeria de Imagens (Upload ImgBB)
              </h2>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleAddGaleriaItem}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f1d4af]/50 border border-[#ece5ce] text-xs font-extrabold text-[#774f38] flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <IconPlus size={14} />
                <span>+ Adicionar Imagem à Galeria</span>
              </button>
            </div>

            {galeria.length === 0 ? (
              <div className="p-6 text-center rounded-2xl border border-dashed border-[#774f38]/20 bg-white/40">
                <IconImage size={32} className="mx-auto text-[#774f38]/40 mb-2" />
                <p className="text-xs font-bold text-[#774f38]/70">
                  Nenhuma imagem adicionada à galeria.
                </p>
                <p className="text-[11px] text-[#774f38]/50 mt-0.5">
                  Clique no botão acima para selecionar fotos do seu dispositivo.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {galeria.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white/70 rounded-2xl border border-white/90 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                  >
                    {/* Miniatura / Preview */}
                    <div className="w-20 h-20 rounded-xl bg-[#f1d4af]/30 border border-[#ece5ce] overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                      {item.previewUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IconImage size={24} className="text-[#774f38]/40" />
                      )}
                    </div>

                    {/* Inputs da Imagem */}
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        disabled={isProcessing}
                        value={item.titulo}
                        onChange={(e) => handleGaleriaTituloChange(item.id, e.target.value)}
                        placeholder="Título / Legenda da Imagem (ex: Posicionamento no Altar)"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#ece5ce] bg-white text-xs sm:text-sm font-bold text-[#774f38] focus:outline-none focus:ring-2 focus:ring-[#e08e79]"
                      />

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-[#ece5ce] hover:bg-[#f1d4af]/40 text-xs font-bold text-[#774f38] flex items-center gap-1.5 shadow-2xs">
                          <IconUpload size={14} />
                          <span>{item.file ? "Trocar Arquivo" : "Selecionar Arquivo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isProcessing}
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              handleGaleriaFileChange(item.id, f);
                            }}
                            className="hidden"
                          />
                        </label>
                        {item.file && (
                          <span className="text-[11px] font-semibold text-[#774f38]/80 truncate max-w-[200px]">
                            {item.file.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botão Remover */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleRemoveGaleriaItem(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer self-end sm:self-center"
                      title="Remover imagem"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTÃO DE AÇÃO PRINCIPAL */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-[22px] bg-[#774f38] hover:bg-[#5f3e2b] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-all transform active:scale-[0.99] cursor-pointer ${
                isProcessing ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>{statusMessage || "Processando..."}</span>
                </>
              ) : (
                <>
                  <IconCode size={20} />
                  <span>Converter para objeto adicionável</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* MODAL / CARD DE EXIBIÇÃO DO JSON FINAL */}
        {finalJsonResult && (
          <div className="mt-10 p-6 rounded-[28px] apple-glass-card border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-emerald-800">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <IconCheck size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#774f38]">
                    Objeto JSON Gerado com Sucesso!
                  </h3>
                  <p className="text-xs text-[#774f38]/70 font-medium">
                    O download automático do arquivo foi disparado. Você também pode copiar o conteúdo abaixo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-4 py-2 rounded-xl bg-white border border-[#ece5ce] hover:bg-emerald-50 text-xs font-black text-[#774f38] flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <IconCheck size={16} className="text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <IconCopy size={16} />
                      <span>Copiar para Área de Transferência</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visualizador de Código JSON */}
            <div className="relative rounded-2xl bg-[#1e1e1e] text-[#f8f8f2] p-4 text-xs font-mono overflow-x-auto max-h-96 shadow-inner">
              <pre>{JSON.stringify(finalJsonResult, null, 2)}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
