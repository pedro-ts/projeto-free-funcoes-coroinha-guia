/**
 * @file database/schema.ts
 * @description Definições de tipos e esquemas para a camada de dados do aplicativo Servire.
 * 
 * Este arquivo define a estrutura estrita de cada função litúrgica, seus passos,
 * decisões condicionais, distribuição de itens por pessoa e galeria de fotos.
 */

/** Opção dentro de uma pergunta de decisão (ex: Missa Rezada vs Cantada) */
export interface OpcaoDecisao {
  /** Rótulo da opção exibido no botão (ex: 'Rezada', 'Cantada') */
  titulo_opcao: string;
  /** Instruções textuais detalhadas correspondentes a essa opção */
  conteudo: string;
}

/** Campo de texto estático (sem decisão condicional) */
export interface CampoTexto {
  eh_decisao: false;
  conteudo: string;
}

/** Campo com bifurcação/decisão interativa para o usuário escolher */
export interface CampoDecisao {
  eh_decisao: true;
  pergunta: string;
  opcoes: OpcaoDecisao[];
}

/** União de tipos para campos de conteúdo de um passo */
export type Campo = CampoTexto | CampoDecisao;

/** Conteúdo estruturado das etapas litúrgicas */
export interface Conteudo {
  /** Passo 0: Orientações de horário e saída para preparação */
  quando_sair_para_preparar: CampoTexto;
  /** Passo 1: Modo de execução litúrgica (geralmente com decisões) */
  como_fazer: Campo;
  /** Passo 2: Momento e frequência de execução na liturgia */
  quando_fazer: Campo;
}

/** Item da galeria de imagens explicativas */
export interface GaleriaItem {
  /** Título/legenda da fotografia */
  titulo: string;
  /** URL pública da imagem */
  link: string;
}

/** Relação entre a pessoa/função e o item ou paramento que deve portar */
export interface PessoaItem {
  /** Função da pessoa (ex: 'Celebrante', 'Diácono', 'Acólito', 'Coroinha') */
  pessoa: string;
  /** Item ou paramento associado (ex: 'Alva, casula e estola', 'Cruz processional') */
  item: string;
}

/**
 * Entidade principal: Função Litúrgica
 * Representa uma função completa cadastrada no banco de dados do Servire.
 */
export interface Funcao {
  /** Nome descritivo da função (ex: 'Missa Dominical com Santíssimo') */
  nome: string;
  /** Identificador numérico da função (1, 2, 3...) */
  numero: number;
  /** Tags das missas em que esta função se faz presente (ex: ['domingo', 'com santissimo']) */
  missas_presentes: string[];
  /** Conteúdo detalhado das etapas da função */
  conteudo: Conteudo;
  /** Lista de itens associados a cada pessoa na equipe */
  pessoa_x_item: PessoaItem[];
  /** Galeria visual de imagens para consulta */
  galeria: GaleriaItem[];
}

/** Chave de filtro de categoria */
export type FiltroCategoriaKey = "todas" | "com santissimo" | "domingo" | "especial" | string;

/** Definição de um filtro da tela inicial */
export interface FiltroCategoria {
  key: FiltroCategoriaKey;
  label: string;
}
