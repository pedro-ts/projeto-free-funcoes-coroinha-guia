/**
 * @file app/adm/page.tsx
 * @description Painel Administrativo do Servire para criação e edição interativa de funções litúrgicas,
 * upload inteligente de imagens (sem re-upload de URLs já existentes) via ImgBB, importação de JSON / arquivo,
 * modal de ações pós-processamento (WhatsApp para o administrador, download do arquivo, copiar JSON e reabrir modal).
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
import { getAllFuncoes } from "@/database/repository";
import { Funcao } from "@/database/schema";

// Lista fixa de opções para a coluna Pessoa
const OPCOES_PESSOA = [
  "Acólito",
  "Coroinha",
  "Acólito e Coroinha",
  "Prioridade ser Acólito",
  "Prioridade ser Coroinha",
  "Ministro",
  "Padre",
  "Leitor",
  "Comentarista",
] as const;

// Tipagens do Formulário
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
  previewUrl: string; // Base64 data:URL ou URL externa http
  existingUrl?: string; // Se já veio de um JSON importado ou upload prévio
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
  // Lista de funções existentes para o select de posição/ordem
  const [funcoesExistentes, setFuncoesExistentes] = useState<Funcao[]>([]);

  // Estado básico
  const [nome, setNome] = useState("");
  const [posicaoApos, setPosicaoApos] = useState<string>("final"); // "inicio", "final", ou "depois_<numero>"
  const [numeroExplicito, setNumeroExplicito] = useState<number>(1);

  // Checkboxes fixos de Missas Presentes
  const [missaDomingo, setMissaDomingo] = useState(true);
  const [missaSantissimo, setMissaSantissimo] = useState(true);

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

  // Estados de Operação / Processamento / Modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [finalJsonResult, setFinalJsonResult] = useState<FuncaoLiturgicaJSONFinal | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Estado de Importação de JSON
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importError, setImportError] = useState("");
  const fileInputImportRef = useRef<HTMLInputElement>(null);

  // Carrega funções cadastradas no banco de dados para o dropdown de ordenação
  useEffect(() => {
    setMounted(true);
    try {
      const list = getAllFuncoes();
      setFuncoesExistentes(list);
      // Por padrão, a nova função entra após a última
      if (list.length > 0) {
        setNumeroExplicito(list.length + 1);
      }
    } catch {
      // Ignora erro se não carregar
    }
  }, []);

  // Recalcula o número com base na seleção de "Depois de qual função entrará"
  useEffect(() => {
    if (posicaoApos === "inicio") {
      setNumeroExplicito(1);
    } else if (posicaoApos === "final") {
      const maxNum = funcoesExistentes.reduce((max, fn) => Math.max(max, fn.numero), 0);
      setNumeroExplicito(maxNum + 1);
    } else if (posicaoApos.startsWith("depois_")) {
      const numBase = parseInt(posicaoApos.replace("depois_", ""), 10);
      setNumeroExplicito(numBase + 1);
    }
  }, [posicaoApos, funcoesExistentes]);

  // --- Handlers de Capa (com FileReader para data:URL estável) ---
  const handleCapaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapaFile(file);
      setCapaUrlExterna("");
      const reader = new FileReader();
      reader.onload = () => {
        setCapaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setGaleria((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              file,
              previewUrl: dataUrl,
              existingUrl: undefined, // sobrescreve url prévia com o novo arquivo
            };
          }
          return item;
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const handleGaleriaTituloChange = (id: string, titulo: string) => {
    setGaleria((prev) =>
      prev.map((item) => (item.id === id ? { ...item, titulo } : item))
    );
  };

  // --- Handlers de Pessoa x Item ---
  const handleAddPessoaItem = () => {
    setPessoaXItem([...pessoaXItem, { pessoa: "Acólito", item: "" }]);
  };

  const handleRemovePessoaItem = (index: number) => {
    setPessoaXItem(pessoaXItem.filter((_, i) => i !== index));
  };

  const handlePessoaItemChange = (index: number, field: "pessoa" | "item", val: string) => {
    setPessoaXItem((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  // --- Upload seguro para o ImgBB via rota interna ---
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

  // --- Processamento e Envio ---
  const handleGerarObjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!nome.trim()) {
      setErrorMessage("Por favor, preencha o Nome da Função.");
      return;
    }

    // Monta a lista de missas presentes a partir dos checkboxes
    const missasTags: string[] = [];
    if (missaDomingo) missasTags.push("domingo");
    if (missaSantissimo) missasTags.push("com santissimo");

    try {
      setIsProcessing(true);
      setStatusMessage("Preparando e verificando imagens...");

      // 1. Capa: se tem arquivo local, faz upload; se tem capaUrlExterna (já existente), reutiliza sem re-upload!
      let finalCapaUrl = capaUrlExterna.trim();
      if (capaFile) {
        setStatusMessage("Enviando imagem de capa para o ImgBB...");
        finalCapaUrl = await uploadSingleImage(capaFile);
      }

      // 2. Galeria: se o item já tem existingUrl, NÃO faz upload duplo; só sobe se for novo File
      const finalGaleria: { titulo: string; link: string }[] = [];
      const newFilesToUpload = galeria.filter((g) => g.file !== null);

      if (newFilesToUpload.length > 0) {
        setStatusMessage(`Enviando ${newFilesToUpload.length} nova(s) imagem(ns) da galeria...`);
      }

      const uploadPromises = galeria.map(async (item) => {
        // Se tem arquivo novo, envia para a API
        if (item.file) {
          const uploadedUrl = await uploadSingleImage(item.file);
          return {
            titulo: item.titulo.trim() || "Foto de referência",
            link: uploadedUrl,
          };
        }
        // Se já tinha URL existente (de importação ou link prévio), reutiliza diretamente
        if (item.existingUrl) {
          return {
            titulo: item.titulo.trim() || "Foto de referência",
            link: item.existingUrl,
          };
        }
        return null;
      });

      const uploadedResults = await Promise.all(uploadPromises);
      for (const res of uploadedResults) {
        if (res) finalGaleria.push(res);
      }

      setStatusMessage("Montando o objeto JSON final...");

      // 3. Monta o Objeto Final
      const objetoFinal: FuncaoLiturgicaJSONFinal = {
        nome: nome.trim(),
        numero: numeroExplicito,
        imagem_capa: finalCapaUrl || undefined,
        missas_presentes: missasTags,
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
      // Abre o Modal com as opções (WhatsApp, Download, Copiar)
      setIsActionModalOpen(true);
      setStatusMessage("");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Falha ao processar o formulário.";
      setErrorMessage(`Erro: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Função para Baixar o Arquivo JSON ---
  const handleDownloadJson = () => {
    if (!finalJsonResult) return;
    const sanitizedName = (finalJsonResult.nome || "funcao")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const fileName = `funcao-${finalJsonResult.numero}-${sanitizedName}.json`;
    const blob = new Blob([JSON.stringify(finalJsonResult, null, 2)], {
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
  };

  // --- Função para Copiar o JSON ---
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

  // --- Função para Enviar para o Administrador via WhatsApp ---
  const handleSendWhatsApp = () => {
    if (!finalJsonResult) return;
    const jsonStr = JSON.stringify(finalJsonResult, null, 2);
    const mensagem = `Olá! Tenho uma sugestão de função litúrgica para o site Servire+:\n\n*${finalJsonResult.nome}* (Ordem: ${finalJsonResult.numero})\n\nConteúdo do objeto JSON:\n\`\`\`json\n${jsonStr}\n\`\`\``;
    const encoded = encodeURIComponent(mensagem);
    const whatsappUrl = `https://wa.me/5511985325391?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  // --- Importador de JSON para Edição ---
  const applyImportedData = (data: any) => {
    try {
      if (!data || typeof data !== "object") {
        throw new Error("Arquivo ou texto inválido.");
      }

      // 1. Nome e Ordem
      if (data.nome) setNome(data.nome);
      if (data.numero) {
        setNumeroExplicito(data.numero);
        // Tenta achar a função anterior para o select de ordem
        const anterior = funcoesExistentes.find((f) => f.numero === data.numero - 1);
        if (anterior) {
          setPosicaoApos(`depois_${anterior.numero}`);
        } else if (data.numero === 1) {
          setPosicaoApos("inicio");
        } else {
          setPosicaoApos("final");
        }
      }

      // 2. Tags de Missas
      if (Array.isArray(data.missas_presentes)) {
        setMissaDomingo(data.missas_presentes.includes("domingo"));
        setMissaSantissimo(data.missas_presentes.includes("com santissimo"));
      }

      // 3. Imagem de Capa (reutiliza URL existente)
      if (data.imagem_capa && typeof data.imagem_capa === "string") {
        setCapaUrlExterna(data.imagem_capa);
        setCapaPreview(data.imagem_capa);
        setCapaFile(null);
      } else {
        setCapaUrlExterna("");
        setCapaPreview("");
        setCapaFile(null);
      }

      // 4. Conteúdo (quando sair, como fazer, quando fazer)
      const parseConteudoItem = (item: any): ConteudoItemForm => {
        if (!item) {
          return {
            eh_decisao: false,
            conteudo: "",
            pergunta: "",
            opcoes: [{ titulo_opcao: "", conteudo: "" }],
          };
        }
        if (item.eh_decisao) {
          return {
            eh_decisao: true,
            conteudo: "",
            pergunta: item.pergunta || "",
            opcoes: Array.isArray(item.opcoes)
              ? item.opcoes.map((op: any) => ({
                  titulo_opcao: op.titulo_opcao || "",
                  conteudo: op.conteudo || "",
                }))
              : [{ titulo_opcao: "", conteudo: "" }],
          };
        }
        return {
          eh_decisao: false,
          conteudo: item.conteudo || "",
          pergunta: "",
          opcoes: [{ titulo_opcao: "", conteudo: "" }],
        };
      };

      if (data.conteudo) {
        setQuandoSair(parseConteudoItem(data.conteudo.quando_sair_para_preparar));
        setComoFazer(parseConteudoItem(data.conteudo.como_fazer));
        setQuandoFazer(parseConteudoItem(data.conteudo.quando_fazer));
      }

      // 5. Pessoa x Item
      if (Array.isArray(data.pessoa_x_item) && data.pessoa_x_item.length > 0) {
        setPessoaXItem(
          data.pessoa_x_item.map((row: any) => ({
            pessoa: row.pessoa || "Acólito",
            item: row.item || "",
          }))
        );
      }

      // 6. Galeria (armazena link existente para não reenviar à API)
      if (Array.isArray(data.galeria)) {
        setGaleria(
          data.galeria.map((g: any) => ({
            id: Math.random().toString(36).substring(2, 9),
            titulo: g.titulo || "",
            file: null,
            previewUrl: g.link || "",
            existingUrl: g.link || "",
          }))
        );
      }

      setIsImportModalOpen(false);
      setImportJsonText("");
      setImportError("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "JSON inválido";
      setImportError(`Erro ao carregar dados: ${msg}`);
    }
  };

  const handleImportFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        applyImportedData(parsed);
      } catch {
        setImportError("O arquivo selecionado não contém um formato JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  const handleImportFromText = () => {
    if (!importJsonText.trim()) {
      setImportError("Por favor, cole o código JSON da função.");
      return;
    }
    try {
      const parsed = JSON.parse(importJsonText);
      applyImportedData(parsed);
    } catch {
      setImportError("O texto colado não é um JSON válido. Verifique chaves e aspas.");
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
      <header className="sticky top-0 z-40 w-full border-b border-white/80 bg-[#ece5ce]/85 backdrop-blur-xl">
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
                Gerador Administrativo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#774f38] border border-white/90 text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              title="Importar função para editar"
            >
              <IconUpload size={14} />
              <span>Importar Função</span>
            </button>

            {finalJsonResult && (
              <button
                type="button"
                onClick={() => setIsActionModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer transition-all animate-bounce"
                title="Reabrir opções da função gerada"
              >
                <IconCheck size={14} />
                <span>Ver Opções</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#774f38]">
              Gerar ou Editar Função Litúrgica
            </h1>
            <p className="text-xs sm:text-sm text-[#774f38]/80 mt-1 font-medium">
              Preencha os campos abaixo, faça upload de fotos e envie a sugestão diretamente para o administrador via WhatsApp ou baixe o arquivo.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <IconCancel size={18} className="flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">Atenção</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {statusMessage && isProcessing && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-3 animate-pulse shadow-xs">
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
              Identificação & Ordem da Função
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

              {/* Posicionamento Específico: Depois de qual função entrará */}
              <div>
                <label className="block text-xs font-bold text-[#774f38] mb-1">
                  Depois de qual função entrará?
                </label>
                <select
                  disabled={isProcessing}
                  value={posicaoApos}
                  onChange={(e) => setPosicaoApos(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ece5ce] bg-white text-[#774f38] text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#e08e79] cursor-pointer"
                >
                  <option value="inicio">No início (Será a função 1)</option>
                  {funcoesExistentes.map((f) => (
                    <option key={f.numero} value={`depois_${f.numero}`}>
                      Depois da {f.numero}. {f.nome} (Será nº {f.numero + 1})
                    </option>
                  ))}
                  <option value="final">
                    No final (Depois de todas - Será nº{" "}
                    {funcoesExistentes.reduce((max, fn) => Math.max(max, fn.numero), 0) + 1})
                  </option>
                </select>
                <span className="block text-[11px] text-[#774f38]/60 mt-1 font-semibold">
                  Ordem calculada: <strong>{numeroExplicito}</strong>
                </span>
              </div>
            </div>

            {/* Imagem de Capa Principal */}
            <div>
              <label className="block text-xs font-bold text-[#774f38] mb-1">
                Imagem de Capa (Opcional - Enviar Arquivo ou Inserir URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-[#ece5ce] hover:bg-[#f1d4af]/30 text-xs font-bold text-[#774f38] flex items-center gap-2 transition-colors shadow-2xs">
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
                  onChange={(e) => {
                    const url = e.target.value;
                    setCapaUrlExterna(url);
                    setCapaPreview(url);
                  }}
                  placeholder="URL externa existente (https://...)"
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

              {/* Preview Visível da Capa */}
              {capaPreview && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative w-28 h-24 rounded-2xl overflow-hidden border-2 border-white/90 shadow-md bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={capaPreview}
                      alt="Preview capa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Preview carregado
                  </span>
                </div>
              )}
            </div>

            {/* Tags Fixas: Domingo e Com Santíssimo */}
            <div>
              <label className="block text-xs font-bold text-[#774f38] mb-1.5">
                Presença nas Missas (Selecione onde esta função se aplica)
              </label>
              <div className="flex flex-wrap gap-4 items-center p-3 rounded-xl bg-white/60 border border-white/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isProcessing}
                    checked={missaDomingo}
                    onChange={(e) => setMissaDomingo(e.target.checked)}
                    className="w-4 h-4 rounded text-[#e08e79] focus:ring-[#e08e79] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-bold text-[#774f38]">
                    Missa de Domingo
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isProcessing}
                    checked={missaSantissimo}
                    onChange={(e) => setMissaSantissimo(e.target.checked)}
                    className="w-4 h-4 rounded text-[#e08e79] focus:ring-[#e08e79] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-bold text-[#774f38]">
                    Com Santíssimo
                  </span>
                </label>
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
                  {/* Select com as opções fixas */}
                  <div className="flex-1">
                    <select
                      disabled={isProcessing}
                      value={row.pessoa}
                      onChange={(e) => handlePessoaItemChange(idx, "pessoa", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#ece5ce] bg-white text-xs sm:text-sm font-bold text-[#774f38] focus:outline-none focus:ring-2 focus:ring-[#e08e79] cursor-pointer"
                    >
                      {OPCOES_PESSOA.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={row.item}
                      onChange={(e) => handlePessoaItemChange(idx, "item", e.target.value)}
                      placeholder="Item / Paramento (ex: Turíbulo, Naveta, Cálice)"
                      className="w-full px-3 py-2 rounded-lg border border-[#ece5ce] bg-white text-xs sm:text-sm font-bold text-[#774f38] focus:outline-none focus:ring-2 focus:ring-[#e08e79]"
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
                  Clique no botão acima para adicionar fotos locais ou de links prévios.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {galeria.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white/70 rounded-2xl border border-white/90 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                  >
                    {/* Miniatura / Preview Sempre Visível */}
                    <div className="w-20 h-20 rounded-xl bg-[#f1d4af]/30 border border-[#ece5ce] overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-inner">
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

                      <div className="flex items-center gap-2 flex-wrap">
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

                        {item.existingUrl && !item.file && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            URL Reutilizada (sem re-upload)
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

        {/* VISUALIZADOR DE CÓDIGO NO FINAL DA PÁGINA (COM BOTÃO DE REABRIR MODAL) */}
        {finalJsonResult && (
          <div className="mt-10 p-6 rounded-[28px] apple-glass-card border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-emerald-800">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <IconCheck size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#774f38]">
                    Objeto JSON Gerado!
                  </h3>
                  <p className="text-xs text-[#774f38]/70 font-medium">
                    Você pode copiar o código diretamente ou clicar em &quot;Abrir Opções de Compartilhamento&quot;.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <IconCheck size={16} />
                  <span>Abrir Opções de Envio</span>
                </button>

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
                      <span>Copiar JSON</span>
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

      {/* ========================================================================= */}
      {/* MODAL DE AÇÕES PÓS-CONVERSÃO (WHATSAPP, DOWNLOAD, COPIAR, FECHAR) */}
      {/* ========================================================================= */}
      {mounted &&
        isActionModalOpen &&
        finalJsonResult &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-[28px] apple-glass-card bg-[#ece5ce] border border-white p-6 shadow-2xl space-y-5 text-[#774f38]">
              {/* Header do Modal */}
              <div className="flex items-center justify-between border-b border-[#774f38]/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <IconCheck size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-black leading-tight">
                      Função Pronta! O que deseja fazer?
                    </h3>
                    <p className="text-[11px] text-[#774f38]/70 font-semibold">
                      Escolha uma das opções abaixo para sua função:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#774f38] flex items-center justify-center cursor-pointer transition-colors"
                  title="Fechar modal"
                >
                  <IconCancel size={16} strokeWidth={2.4} />
                </button>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3">
                {/* 1. Mandar função para o administrador (WhatsApp) */}
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full p-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-between font-black text-sm shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                      </svg>
                    </div>
                    <div>
                      <p className="leading-tight">Mandar função para o administrador</p>
                      <p className="text-[11px] text-white/80 font-normal">
                        Envia sugestão via WhatsApp para (11) 98532-5391
                      </p>
                    </div>
                  </div>
                  <span className="text-lg">→</span>
                </button>

                {/* 2. Baixar arquivo da função (.json) */}
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="w-full p-3.5 rounded-2xl bg-[#774f38] hover:bg-[#5f3e2b] text-white flex items-center justify-between font-black text-sm shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <IconDownload size={18} />
                    </div>
                    <div>
                      <p className="leading-tight">Baixar arquivo da função (.json)</p>
                      <p className="text-[11px] text-white/70 font-normal">
                        Salva o arquivo formatado em seu computador
                      </p>
                    </div>
                  </div>
                  <span className="text-lg">↓</span>
                </button>

                {/* 3. Copiar conteúdo para a área de transferência */}
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-white/90 text-[#774f38] border border-[#ece5ce] flex items-center justify-between font-black text-sm shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-[#f1d4af]/50 flex items-center justify-center">
                      {copied ? <IconCheck size={18} className="text-emerald-600" /> : <IconCopy size={18} />}
                    </div>
                    <div>
                      <p className="leading-tight">
                        {copied ? "Copiado com sucesso!" : "Copiar conteúdo da função"}
                      </p>
                      <p className="text-[11px] text-[#774f38]/60 font-normal">
                        Copia todo o JSON pronto para colar onde precisar
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#e08e79]">
                    {copied ? "OK" : "Copiar"}
                  </span>
                </button>
              </div>

              {/* Rodapé informativo */}
              <div className="pt-1 flex items-center justify-between text-xs text-[#774f38]/70">
                <span>Você pode fechar e reabrir este modal a qualquer momento.</span>
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="font-bold underline hover:text-[#774f38] cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* MODAL DE IMPORTAÇÃO DE FUNÇÃO PARA EDIÇÃO */}
      {/* ========================================================================= */}
      {mounted &&
        isImportModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-[28px] apple-glass-card bg-[#ece5ce] border border-white p-6 shadow-2xl space-y-4 text-[#774f38]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#774f38]/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#f1d4af] flex items-center justify-center text-[#774f38]">
                    <IconUpload size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-black">Importar Função para Edição</h3>
                    <p className="text-[11px] text-[#774f38]/70 font-semibold">
                      Carregue um arquivo .json ou cole o código JSON da função
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportError("");
                  }}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#774f38] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <IconCancel size={16} strokeWidth={2.4} />
                </button>
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  {importError}
                </div>
              )}

              {/* Opção 1: Upload de Arquivo .json */}
              <div>
                <label className="block text-xs font-bold text-[#774f38] mb-1">
                  1. Selecionar arquivo .json baixado anteriormente
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputImportRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#ece5ce] hover:bg-[#f1d4af]/30 text-xs font-black text-[#774f38] flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
                  >
                    <IconUpload size={15} />
                    <span>Escolher Arquivo (.json)</span>
                  </button>
                  <input
                    ref={fileInputImportRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFromFile}
                    className="hidden"
                  />
                  <span className="text-[11px] text-[#774f38]/60 font-semibold">
                    Preencherá os campos automaticamente
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 my-1">
                <div className="flex-1 h-px bg-[#774f38]/15" />
                <span className="text-[11px] font-black text-[#774f38]/50 uppercase">ou</span>
                <div className="flex-1 h-px bg-[#774f38]/15" />
              </div>

              {/* Opção 2: Colar Texto JSON */}
              <div>
                <label className="block text-xs font-bold text-[#774f38] mb-1">
                  2. Colar código JSON diretamente
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Cole aqui o objeto JSON da função..."
                  className="w-full p-3 rounded-xl border border-[#ece5ce] bg-white text-xs font-mono text-[#774f38] focus:outline-none focus:ring-2 focus:ring-[#e08e79] resize-y"
                />
              </div>

              {/* Botões do Modal de Importação */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportError("");
                  }}
                  className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white text-xs font-bold text-[#774f38] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleImportFromText}
                  className="px-5 py-2 rounded-xl bg-[#774f38] hover:bg-[#5f3e2b] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Carregar Dados no Formulário
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
