export interface Prato {
  id: string
  nome: string
  descricao: string
  ingredientes: string[]
  tamanhos: Tamanho[] // adicionado suporte a múltiplos tamanhos
  preco: number // preço padrão (para compatibilidade)
  imagem: string
  categoria: "prato" | "bebida" | "doce" | "adicional"
}

export interface Adicional {
  id: string
  nome: string
  preco: number
}

export interface ItemCarrinho {
  id: string
  prato: Prato
  quantidade: number
  tamanho?: Tamanho // adicionado tamanho selecionado
  adicionais: Adicional[]
  observacoes: string
}

export interface Pedido {
  id: string // ID único do pedido
  clienteId: string // ID único do cliente
  itens: ItemCarrinho[]
  total: number
  frete: number
  tipoPagamento: string
  tipoEntrega: "entrega" | "retirada"
  observacoes: string
  nomeCliente: string
  telefoneCliente: string
  dataPedido: string
  status: "pendente" | "preparando" | "pronto" | "entregue"
  whatsappEnviado?: boolean
}

export interface HorarioAtendimento {
  dia: string
  abertura: string
  fechamento: string
}

export interface FretePadrao {
  id: string
  descricao: string
  preco: number
}

export interface Admin {
  email: string
  senha: string
}

export interface Tamanho {
  id: string
  nome: string // P, M, G
  preco: number
}
