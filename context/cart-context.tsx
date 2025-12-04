"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ItemCarrinho, Prato, Adicional, Pedido, Tamanho } from "@/types"
import { createPedido, createCliente, getClientePorTelefone } from "@/lib/supabase/queries"

interface CartContextType {
  itens: ItemCarrinho[]
  total: number
  frete: number
  itemCount: number
  addItem: (
    prato: Prato,
    quantidade: number,
    tamanho: Tamanho | undefined,
    adicionais: Adicional[],
    observacoes: string,
  ) => void
  removeItem: (id: string) => void
  updateItem: (id: string, quantidade: number) => void
  clearCart: () => void
  setFrete: (valor: number) => void
  criarPedido: (
    nomeCliente: string,
    telefoneCliente: string,
    tipoPagamento: string,
    tipoEntrega: "entrega" | "retirada",
    observacoes: string,
    endereco?: {
      rua: string
      numero: string
      bairro: string
      cep: string
      complemento: string
      regiao: string
    },
  ) => Promise<void>
  pedidos: Pedido[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: React.ReactNode) {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [frete, setFrete] = useState(0)
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  useEffect(() => {
    const savedPedidos = localStorage.getItem("hermesOrder")
    if (savedPedidos) {
      setPedidos(JSON.parse(savedPedidos))
    }
  }, [])

  const itemCount = itens.reduce((acc, item) => acc + item.quantidade, 0)

  const total =
    itens.reduce((acc, item) => {
      const precoBase = item.tamanho ? item.tamanho.preco : item.prato.preco
      const precoAdicionais = item.adicionais.reduce((sum, a) => sum + a.preco, 0)
      return acc + (precoBase + precoAdicionais) * item.quantidade
    }, 0) + frete

  const addItem = (
    prato: Prato,
    quantidade: number,
    tamanho: Tamanho | undefined,
    adicionais: Adicional[],
    observacoes: string,
  ) => {
    setItens((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        prato,
        quantidade,
        tamanho,
        adicionais,
        observacoes,
      },
    ])
  }

  const removeItem = (id: string) => {
    setItens((prev) => prev.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, quantidade: number) => {
    setItens((prev) => prev.map((item) => (item.id === id ? { ...item, quantidade: Math.max(1, quantidade) } : item)))
  }

  const clearCart = () => {
    setItens([])
    setFrete(0)
  }

  const criarPedido = async (
    nomeCliente: string,
    telefoneCliente: string,
    tipoPagamento: string,
    tipoEntrega: "entrega" | "retirada",
    observacoes: string,
    endereco?: {
      rua: string
      numero: string
      bairro: string
      cep: string
      complemento: string
      regiao: string
    },
  ) => {
    try {
      const clienteId = `CLI_${Date.now()}`
      const pedidoId = `PED_${Date.now()}`

      // Normalizar telefone: remover todos os caracteres não numéricos
      const telefoneNormalizado = telefoneCliente.replace(/\D/g, "")

      let cliente = await getClientePorTelefone(telefoneNormalizado)
      if (!cliente) {
        cliente = await createCliente(nomeCliente, telefoneNormalizado)
      }

      const itensData = itens.map((item) => ({
        id: item.id,
        nome: item.prato.nome,
        tamanho: item.tamanho?.nome,
        preco: item.tamanho?.preco || item.prato.preco,
        quantidade: item.quantidade,
        adicionais: item.adicionais,
        observacoes: item.observacoes,
      }))

      const pedidoData = {
        pedido_id: pedidoId,
        cliente_id: cliente?.id,
        cliente_nome: nomeCliente,
        cliente_telefone: telefoneNormalizado,
        itens: itensData,
        adicionais: [],
        observacoes,
        tipo_entrega: tipoEntrega,
        valor_frete: tipoEntrega === "entrega" ? frete : 0,
        forma_pagamento: tipoPagamento,
        total,
        status: "pendente",
        endereco_entrega: tipoEntrega === "entrega" && endereco ? {
          rua: endereco.rua,
          numero: endereco.numero,
          bairro: endereco.bairro,
          cep: endereco.cep,
          complemento: endereco.complemento,
          regiao: endereco.regiao,
        } : null,
      }

      const novoPedido = await createPedido(pedidoData)

      // Limpar carrinho após criar pedido com sucesso
      clearCart()

      // Salvar também no localStorage como backup
      const novoPedidoLocal: Pedido = {
        id: pedidoId,
        clienteId,
        itens,
        total,
        frete,
        tipoPagamento,
        tipoEntrega,
        observacoes,
        nomeCliente,
        telefoneCliente,
        dataPedido: new Date().toISOString(),
        status: "pendente",
      }

      const novosPedidos = [novoPedidoLocal, ...pedidos]
      setPedidos(novosPedidos)
      localStorage.setItem("hermesOrder", JSON.stringify(novosPedidos))

      playNotificationSound()

      // Disparar evento para atualizar admin em tempo real
      window.dispatchEvent(new CustomEvent("novoPedido", { detail: novoPedidoLocal }))

      // Chamar webhook do WhatsApp para notificar o cliente
      try {
        await fetch("/api/webhook/whatsapp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pedido_id: pedidoId,
            cliente_telefone: telefoneCliente,
            cliente_nome: nomeCliente,
            total,
            itens: itensData,
            tipo_entrega: tipoEntrega,
            forma_pagamento: tipoPagamento,
          }),
        })
      } catch (error) {
        // Não bloquear o pedido se o webhook falhar
        console.error("[v0] Erro ao chamar webhook WhatsApp:", error)
      }
    } catch (error) {
      console.error("[v0] Erro ao criar pedido:", error)
      throw error
    }
  }

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) {
      console.log("[v0] Audio not available")
    }
  }

  return (
    <CartContext.Provider
      value={{
        itens,
        total,
        frete,
        itemCount,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        setFrete,
        criarPedido,
        pedidos,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider")
  }
  return context
}
