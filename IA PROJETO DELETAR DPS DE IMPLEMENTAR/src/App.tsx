import { useState } from "react";
import rawData from "./data/funcoes.json";

// ── Paleta ─────────────────────────────────────────────────────────────────────
const C = {
  marrom:      "#774f38",
  salmao:      "#e08e79",
  begeEscuro:  "#f1d4af",
  begeClaro:   "#ece5ce",
};

// ── Types derivados do JSON ────────────────────────────────────────────────────
interface OpcaoDecisao {
  titulo_opcao: string;
  conteudo: string;
}

interface CampoTexto {
  eh_decisao: false;
  conteudo: string;
}

interface CampoDecisao {
  eh_decisao: true;
  pergunta: string;
  opcoes: OpcaoDecisao[];
}

type Campo = CampoTexto | CampoDecisao;

interface Conteudo {
  quando_sair_para_preparar: CampoTexto;
  como_fazer: Campo;
  quando_fazer: Campo;
}

interface GaleriaItem { titulo: string; link: string; }
interface PessoaItem   { pessoa: string; item: string; }

interface Funcao {
  nome: string;
  numero: number;
  missas_presentes: string[];
  conteudo: Conteudo;
  pessoa_x_item: PessoaItem[];
  galeria: GaleriaItem[];
}

// Imagem de fallback por número para o card (usamos a primeira foto da galeria)
const FUNCOES: Funcao[] = rawData as Funcao[];

// Imagem de capa: primeira foto da galeria de cada função
function capaUrl(fn: Funcao) {
  return fn.galeria[0]?.link ?? "";
}

// ── Step meta ─────────────────────────────────────────────────────────────────
const STEPS = [
  { emoji: "🚪", label: "Quando sair?" },
  { emoji: "❓", label: "Como fazer?" },
  { emoji: "🕗", label: "Quando fazer?" },
  { emoji: "👤", label: "Itens" },
  { emoji: "📷", label: "Galeria" },
];

// ── Filtros disponíveis ───────────────────────────────────────────────────────
const FILTROS = [
  { key: "todas",         label: "Todas" },
  { key: "com santissimo", label: "✨ Com Santíssimo" },
  { key: "domingo",       label: "🕊️ Domingo" },
  { key: "especial",      label: "🌟 Especial" },
];

// ── Componente de conteúdo de cada passo ──────────────────────────────────────
function StepBody({
  fn,
  stepIndex,
  decisions,
  onDecide,
}: {
  fn: Funcao;
  stepIndex: number;
  decisions: Record<string, string>;
  onDecide: (key: string, val: string) => void;
}) {
  const decisionKey = `${fn.numero}-${stepIndex}`;

  // Passo 0 — Quando sair
  if (stepIndex === 0) {
    return (
      <p className="leading-relaxed text-[15px] font-600" style={{ color: C.marrom }}>
        {fn.conteudo.quando_sair_para_preparar.conteudo}
      </p>
    );
  }

  // Passo 1 — Como fazer
  if (stepIndex === 1) {
    return <CampoRenderer campo={fn.conteudo.como_fazer} decisionKey={decisionKey} decisions={decisions} onDecide={onDecide} />;
  }

  // Passo 2 — Quando fazer
  if (stepIndex === 2) {
    return <CampoRenderer campo={fn.conteudo.quando_fazer} decisionKey={decisionKey} decisions={decisions} onDecide={onDecide} />;
  }

  // Passo 3 — Pessoa x Item
  if (stepIndex === 3) {
    return (
      <div className="overflow-hidden rounded-2xl" style={{ border: `1.5px solid ${C.begeEscuro}` }}>
        <div className="grid grid-cols-2 px-4 py-2" style={{ background: C.begeEscuro }}>
          <span className="text-[11px] font-900 uppercase tracking-wider" style={{ color: C.marrom }}>Pessoa</span>
          <span className="text-[11px] font-900 uppercase tracking-wider" style={{ color: C.marrom }}>Item</span>
        </div>
        {fn.pessoa_x_item.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-2 px-4 py-3"
            style={{
              background: i % 2 === 0 ? "rgba(255,255,255,0.55)" : `${C.begeClaro}88`,
              borderTop: `1px solid ${C.begeEscuro}66`,
            }}
          >
            <span className="text-[13px] font-800" style={{ color: C.marrom }}>{row.pessoa}</span>
            <span className="text-[13px] font-600" style={{ color: "#a0715a" }}>{row.item}</span>
          </div>
        ))}
      </div>
    );
  }

  // Passo 4 — Galeria
  if (stepIndex === 4) {
    return (
      <div className="space-y-3">
        {fn.galeria.map((foto, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: C.begeEscuro }}>
            <img src={foto.link} alt={foto.titulo} className="w-full h-44 object-cover" />
            {foto.titulo && (
              <p className="px-3 py-2 text-xs font-700" style={{ color: C.marrom }}>{foto.titulo}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function CampoRenderer({
  campo,
  decisionKey,
  decisions,
  onDecide,
}: {
  campo: Campo;
  decisionKey: string;
  decisions: Record<string, string>;
  onDecide: (key: string, val: string) => void;
}) {
  if (!campo.eh_decisao) {
    return (
      <p className="leading-relaxed text-[15px] font-600 whitespace-pre-line" style={{ color: C.marrom }}>
        {campo.conteudo}
      </p>
    );
  }

  const chosen = decisions[decisionKey];
  const chosenOption = campo.opcoes.find((o) => o.titulo_opcao === chosen);

  if (!chosenOption) {
    return (
      <div className="space-y-4">
        <p className="font-800 text-lg text-center" style={{ color: C.marrom }}>{campo.pergunta}</p>
        <div className="space-y-3">
          {campo.opcoes.map((opt) => (
            <button
              key={opt.titulo_opcao}
              onClick={() => onDecide(decisionKey, opt.titulo_opcao)}
              className="w-full py-4 px-5 rounded-2xl text-left transition-all duration-150 active:scale-98"
              style={{ background: `${C.begeEscuro}99`, border: `2px solid ${C.salmao}55` }}
            >
              <span className="font-800 text-[15px]" style={{ color: C.marrom }}>{opt.titulo_opcao}</span>
              <span className="ml-2 text-xs font-600" style={{ color: C.salmao }}>Toque para selecionar →</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="px-3 py-1 rounded-full text-xs font-800"
          style={{ background: `${C.salmao}22`, color: C.marrom }}
        >
          {chosenOption.titulo_opcao}
        </span>
        <button
          onClick={() => onDecide(decisionKey, "")}
          className="px-3 py-1 rounded-full text-xs font-700 transition-colors"
          style={{ background: `${C.begeEscuro}99`, color: C.salmao }}
        >
          ↩ Trocar escolha
        </button>
      </div>
      <p className="leading-relaxed text-[15px] font-600 whitespace-pre-line" style={{ color: C.marrom }}>
        {chosenOption.conteudo}
      </p>
    </div>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────
function HomeScreen({ onSelect }: { onSelect: (fn: Funcao) => void }) {
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState("todas");

  const filtered = FUNCOES.filter((fn) => {
    const matchNome = fn.nome.toLowerCase().includes(query.toLowerCase());
    const matchFiltro = filtro === "todas" || fn.missas_presentes.includes(filtro);
    return matchNome && matchFiltro;
  });

  return (
    <div className="min-h-full" style={{ background: `linear-gradient(160deg, ${C.begeClaro} 0%, ${C.begeEscuro} 100%)` }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-10 pb-4"
        style={{
          background: `${C.begeClaro}dd`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.begeEscuro}`,
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">⛪</span>
          <div>
            <h1 className="text-2xl leading-tight font-900" style={{ color: C.marrom }}>Liturgia</h1>
            <p className="text-xs font-700 uppercase tracking-wide" style={{ color: C.salmao }}>Guia de Funções</p>
          </div>
        </div>

        {/* Busca */}
        <div className="relative mt-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: C.salmao }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar função..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-[15px] font-600 outline-none"
            style={{
              background: "rgba(255,255,255,0.75)",
              border: `1.5px solid ${C.begeEscuro}`,
              color: C.marrom,
            }}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-700 transition-all duration-200"
              style={
                filtro === f.key
                  ? { background: C.salmao, color: "white", boxShadow: `0 4px 12px ${C.salmao}55` }
                  : { background: "rgba(255,255,255,0.65)", color: C.marrom, border: `1.5px solid ${C.begeEscuro}` }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="px-5 pb-10 pt-4">
        <p className="text-xs font-700 uppercase tracking-wider mb-4" style={{ color: C.salmao }}>
          {filtered.length} {filtered.length === 1 ? "função" : "funções"}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map((fn) => (
            <button
              key={fn.numero}
              onClick={() => onSelect(fn)}
              className="text-left rounded-3xl overflow-hidden transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1.5px solid rgba(255,255,255,0.9)`,
                boxShadow: `0 4px 24px ${C.marrom}18`,
              }}
            >
              {/* Imagem */}
              <div className="relative w-full h-28" style={{ background: C.begeEscuro }}>
                <img src={capaUrl(fn)} alt={fn.nome} className="w-full h-full object-cover" />

                {/* Número */}
                <div
                  className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-900"
                  style={{ background: "rgba(255,255,255,0.92)", color: C.marrom, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                >
                  {fn.numero}
                </div>

                {/* Badges de tipo */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                  {fn.missas_presentes.includes("com santissimo") && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-800"
                      style={{ background: `${C.salmao}ee`, color: "white" }}
                    >
                      ✨
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-[13px] font-800 leading-snug" style={{ color: C.marrom }}>{fn.nome}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {fn.missas_presentes.map((m) => (
                    <span key={m} className="text-[10px] font-700 capitalize" style={{ color: C.salmao }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="font-700" style={{ color: C.marrom }}>Nenhuma função encontrada</p>
            <p className="text-sm mt-1" style={{ color: C.salmao }}>Tente outro termo ou filtro</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Full Info Screen ──────────────────────────────────────────────────────────
function FullInfoScreen({
  fn,
  decisions,
  onBack,
}: {
  fn: Funcao;
  decisions: Record<string, string>;
  onBack: () => void;
}) {
  return (
    <div className="min-h-full overflow-y-auto" style={{ background: `linear-gradient(160deg, ${C.begeClaro} 0%, ${C.begeEscuro} 100%)` }}>
      <div
        className="sticky top-0 z-10 px-5 pt-8 pb-3 flex items-center gap-3"
        style={{ background: `${C.begeClaro}e8`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.8)", boxShadow: `0 2px 12px ${C.marrom}22` }}
        >
          <span className="font-900 text-lg" style={{ color: C.marrom }}>←</span>
        </button>
        <div>
          <p className="text-xs font-700 uppercase tracking-wider" style={{ color: C.salmao }}>Visão Completa</p>
          <h2 className="text-base font-900 leading-tight" style={{ color: C.marrom }}>{fn.nome}</h2>
        </div>
      </div>

      <div className="px-5 pb-10 pt-2 space-y-5">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className="rounded-3xl p-5 anim-fade"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1.5px solid rgba(255,255,255,0.9)`,
              boxShadow: `0 4px 24px ${C.marrom}12`,
              animationDelay: `${i * 0.07}s`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${C.begeEscuro}` }}
              >
                {s.emoji}
              </div>
              <span className="font-800 text-[15px]" style={{ color: C.marrom }}>{s.label}</span>
            </div>
            <StepBody fn={fn} stepIndex={i} decisions={decisions} onDecide={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Wizard Screen ─────────────────────────────────────────────────────────────
function WizardScreen({
  fn,
  step,
  direction,
  animKey,
  decisions,
  onDecide,
  onNext,
  onPrev,
  onBack,
  onViewAll,
}: {
  fn: Funcao;
  step: number;
  direction: "forward" | "backward";
  animKey: number;
  decisions: Record<string, string>;
  onDecide: (key: string, val: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onBack: () => void;
  onViewAll: () => void;
}) {
  const stepMeta = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === 4;

  return (
    <div
      className="h-full flex flex-col overflow-hidden select-none"
      style={{ background: `linear-gradient(160deg, ${C.begeClaro} 0%, ${C.begeEscuro} 100%)` }}
    >
      {/* Barra superior */}
      <div
        className="flex items-center justify-between px-5 pt-10 pb-3 flex-shrink-0"
        style={{ background: `${C.begeClaro}cc`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.8)", boxShadow: `0 2px 10px ${C.marrom}20` }}
        >
          <span className="font-900" style={{ color: C.marrom }}>←</span>
        </button>

        <div className="text-center">
          <p className="text-xs font-800 uppercase tracking-wider" style={{ color: C.salmao }}>{fn.nome}</p>
          <p className="text-[11px] font-600" style={{ color: `${C.marrom}88` }}>
            Passo {step + 1} de {STEPS.length}
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="px-3 py-2 rounded-2xl text-xs font-800 transition-all active:scale-90"
          style={{ background: `${C.salmao}22`, color: C.marrom }}
        >
          Ver Tudo
        </button>
      </div>

      {/* Dots de progresso */}
      <div className="flex justify-center gap-2 py-3 flex-shrink-0">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className="transition-all duration-300 flex items-center justify-center"
            style={{
              width: i === step ? "28px" : "8px",
              height: "8px",
              borderRadius: "99px",
              background:
                i === step
                  ? C.salmao
                  : i < step
                  ? `${C.salmao}55`
                  : `${C.marrom}22`,
            }}
          >
            {i === step && <span style={{ fontSize: "8px" }}>{s.emoji}</span>}
          </div>
        ))}
      </div>

      {/* Área principal com zonas de toque */}
      <div className="flex-1 relative flex items-stretch overflow-hidden px-4 pb-4">
        {/* Seta esquerda */}
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="absolute left-0 top-0 bottom-0 w-14 z-10 flex items-center justify-start pl-1 transition-opacity"
          style={{ opacity: isFirst ? 0 : 1 }}
          aria-label="Passo anterior"
        >
          <div
            className="w-9 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: `0 2px 12px ${C.marrom}18`,
            }}
          >
            <span className="font-900 text-xl" style={{ color: C.salmao }}>‹</span>
          </div>
        </button>

        {/* Seta direita */}
        <button
          onClick={onNext}
          disabled={isLast}
          className="absolute right-0 top-0 bottom-0 w-14 z-10 flex items-center justify-end pr-1 transition-opacity"
          style={{ opacity: isLast ? 0 : 1 }}
          aria-label="Próximo passo"
        >
          <div
            className="w-9 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: `0 2px 12px ${C.marrom}18`,
            }}
          >
            <span className="font-900 text-xl" style={{ color: C.salmao }}>›</span>
          </div>
        </button>

        {/* Card animado */}
        <div
          key={animKey}
          className={`flex-1 mx-10 overflow-y-auto rounded-3xl ${direction === "forward" ? "anim-slide-right" : "anim-slide-left"}`}
          style={{
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255,255,255,0.95)",
            boxShadow: `0 8px 40px ${C.marrom}18, 0 2px 8px rgba(0,0,0,0.04)`,
          }}
        >
          <div className="p-5">
            {/* Cabeçalho do passo */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: C.begeEscuro }}
              >
                {stepMeta.emoji}
              </div>
              <h2 className="font-900 text-lg leading-snug" style={{ color: C.marrom }}>
                {stepMeta.label}
              </h2>
            </div>

            <StepBody fn={fn} stepIndex={step} decisions={decisions} onDecide={onDecide} />
          </div>
        </div>
      </div>

      {/* Hint inferior */}
      <div className="flex-shrink-0 pb-6 px-5">
        <div
          className="rounded-2xl py-2 px-4 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.45)", border: `1px solid rgba(255,255,255,0.8)` }}
        >
          <span className="text-[11px] font-700" style={{ color: C.salmao }}>
            {isFirst && !isLast && "Toque › para avançar"}
            {!isFirst && !isLast && "Toque ‹ ou › para navegar"}
            {isLast && "Chegou ao final · Toque ‹ para voltar"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<"home" | "wizard" | "full">("home");
  const [selected, setSelected] = useState<Funcao | null>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, string>>({});

  const openFunction = (fn: Funcao) => {
    setSelected(fn);
    setStep(0);
    setDecisions({});
    setDirection("forward");
    setAnimKey(0);
    setScreen("wizard");
  };

  const goStep = (newStep: number, dir: "forward" | "backward") => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setStep(newStep);
  };

  if (screen === "home") {
    return <HomeScreen onSelect={openFunction} />;
  }

  if (screen === "wizard" && selected) {
    return (
      <WizardScreen
        fn={selected}
        step={step}
        direction={direction}
        animKey={animKey}
        decisions={decisions}
        onDecide={(key, val) => setDecisions((d) => ({ ...d, [key]: val }))}
        onNext={() => { if (step < 4) goStep(step + 1, "forward"); }}
        onPrev={() => { if (step > 0) goStep(step - 1, "backward"); }}
        onBack={() => setScreen("home")}
        onViewAll={() => setScreen("full")}
      />
    );
  }

  if (screen === "full" && selected) {
    return (
      <FullInfoScreen
        fn={selected}
        decisions={decisions}
        onBack={() => setScreen("wizard")}
      />
    );
  }

  return null;
}
