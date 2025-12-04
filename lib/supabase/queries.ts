import { createClient } from "./client"

// Pratos
export async function getPratos() {
  const supabase = createClient()
  const { data, error } = await supabase.from("pratos").select("*")
  if (error) console.error("[v0] Erro ao buscar pratos:", error)
  return data || []
}

export async function createPrato(prato: any) {
  const supabase = createClient()
  
  // Preparar dados para inserção (remover campos que não existem na tabela)
  const pratoData: any = {
    nome: prato.nome,
    descricao: prato.descricao || null,
    imagem_url: prato.imagem_url || null,
    tamanhos: prato.tamanhos || [],
  }
  
  // Adicionar categoria e preco se existirem (após executar o script SQL)
  if (prato.categoria) {
    pratoData.categoria = prato.categoria
  }
  if (prato.preco !== undefined) {
    pratoData.preco = prato.preco
  }
  
  const { data, error } = await supabase.from("pratos").insert([pratoData]).select()
  
  if (error) {
    console.error("[v0] Erro ao criar prato:", error)
    console.error("[v0] Detalhes do erro:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(error.message || "Erro ao criar prato no banco de dados")
  }
  
  return data?.[0]
}

export async function updatePrato(id: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from("pratos").update(updates).eq("id", id).select()
  if (error) console.error("[v0] Erro ao atualizar prato:", error)
  return data?.[0]
}

export async function deletePrato(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("pratos").delete().eq("id", id)
  if (error) console.error("[v0] Erro ao deletar prato:", error)
  return !error
}

// Adicionais
export async function getAdicionais() {
  const supabase = createClient()
  const { data, error } = await supabase.from("adicionais").select("*")
  if (error) console.error("[v0] Erro ao buscar adicionais:", error)
  return data || []
}

export async function createAdicional(adicional: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from("adicionais").insert([adicional]).select()
  if (error) console.error("[v0] Erro ao criar adicional:", error)
  return data?.[0]
}

// Clientes
export async function createCliente(nome: string, telefone: string) {
  const supabase = createClient()
  // Normalizar telefone: remover todos os caracteres não numéricos
  const telefoneNormalizado = telefone.replace(/\D/g, "")
  const { data, error } = await supabase.from("clientes").insert([{ nome, telefone: telefoneNormalizado }]).select()
  if (error) console.error("[v0] Erro ao criar cliente:", error)
  return data?.[0]
}

export async function getClientePorTelefone(telefone: string) {
  const supabase = createClient()
  // Normalizar telefone: remover todos os caracteres não numéricos
  const telefoneNormalizado = telefone.replace(/\D/g, "")
  const { data, error } = await supabase.from("clientes").select("*").eq("telefone", telefoneNormalizado).single()
  if (error && error.code !== "PGRST116") console.error("[v0] Erro ao buscar cliente:", error)
  return data
}

// Pedidos
export async function createPedido(pedido: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from("pedidos").insert([pedido]).select()
  if (error) console.error("[v0] Erro ao criar pedido:", error)
  return data?.[0]
}

export async function getPedidos() {
  const supabase = createClient()
  const { data, error } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false })
  if (error) console.error("[v0] Erro ao buscar pedidos:", error)
  return data || []
}

export async function getPedidosPorTelefone(telefone: string) {
  const supabase = createClient()
  // Normalizar telefone: remover todos os caracteres não numéricos
  const telefoneNormalizado = telefone.replace(/\D/g, "")
  
  // Buscar todos os pedidos e filtrar no cliente para lidar com diferentes formatos
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("[v0] Erro ao buscar pedidos por telefone:", error)
    return []
  }
  
  if (!data) return []
  
  // Filtrar pedidos onde o telefone normalizado corresponde
  const pedidosFiltrados = data.filter((pedido) => {
    const telefonePedido = (pedido.cliente_telefone || "").replace(/\D/g, "")
    return telefonePedido === telefoneNormalizado
  })
  
  return pedidosFiltrados
}

export async function updatePedidoStatus(id: string, status: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("pedidos")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
  if (error) console.error("[v0] Erro ao atualizar status do pedido:", error)
  return data?.[0]
}

// Fretes
export async function getFretes() {
  const supabase = createClient()
  const { data, error } = await supabase.from("fretes").select("*")
  if (error) console.error("[v0] Erro ao buscar fretes:", error)
  return data || []
}

export async function updateFrete(id: string, valor: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("fretes")
    .update({ valor, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
  if (error) console.error("[v0] Erro ao atualizar frete:", error)
  return data?.[0]
}

// Horários
export async function getHorarios() {
  const supabase = createClient()
  const { data, error } = await supabase.from("horarios").select("*").order("dia_semana")
  if (error) console.error("[v0] Erro ao buscar horários:", error)
  return data || []
}

export async function updateHorario(id: string, abertura: string, fechamento: string, aberto: boolean) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("horarios")
    .update({ abertura, fechamento, aberto, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
  if (error) console.error("[v0] Erro ao atualizar horário:", error)
  return data?.[0]
}

// Prato Dia
export async function getPratosDoDia(dia: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("prato_dia")
    .select("prato_id, pratos(*)")
    .eq("dia_semana", dia)
    .eq("ativo", true)

  if (error) console.error("[v0] Erro ao buscar pratos do dia:", error)
  return data?.map((item: any) => item.pratos) || []
}

export async function getPratosDiasAssociacao() {
  const supabase = createClient()
  const { data, error } = await supabase.from("prato_dia").select("*")
  if (error) console.error("[v0] Erro ao buscar associações prato-dia:", error)
  return data || []
}

export async function criarAssociacaoPratosDia(prato_id: string, dias: string[]) {
  const supabase = createClient()

  // Primeiro deletar todas as associações existentes
  await supabase.from("prato_dia").delete().eq("prato_id", prato_id)

  // Depois inserir novas
  const inserts = dias.map((dia) => ({
    prato_id,
    dia_semana: dia,
    ativo: true,
  }))

  const { data, error } = await supabase.from("prato_dia").insert(inserts).select()
  if (error) console.error("[v0] Erro ao criar associação:", error)
  return data
}

export async function atualizarStatusPratoDia(prato_id: string, dia: string, ativo: boolean) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("prato_dia")
    .update({ ativo })
    .eq("prato_id", prato_id)
    .eq("dia_semana", dia)
    .select()
  if (error) console.error("[v0] Erro ao atualizar status prato-dia:", error)
  return data?.[0]
}
