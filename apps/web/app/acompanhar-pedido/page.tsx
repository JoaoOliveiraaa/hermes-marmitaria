"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPedidosPorTelefone } from "@/lib/supabase/queries"
import { Search, Package, Clock, CheckCircle, XCircle, Truck, MapPin } from "lucide-react"

type Pedido = {
  id: string
  cliente_nome: string
  cliente_telefone: string
  total: number
  status: string
  tipo_entrega: string
  forma_pagamento: string
  created_at: string
  itens: any[]
  endereco_entrega?: any
}

const STATUS_CONFIG: { [key: string]: { label: string; icon: any; color: string; bgColor: string } } = {
  pendente: {
    label: "Pendente",
    icon: Clock,
    color: "text-yellow-800",
    bgColor: "bg-yellow-100",
  },
  preparando: {
    label: "Preparando",
    icon: Package,
    color: "text-blue-800",
    bgColor: "bg-blue-100",
  },
  pronto: {
    label: "Pronto",
    icon: CheckCircle,
    color: "text-green-800",
    bgColor: "bg-green-100",
  },
  entrega: {
    label: "Saiu para entrega",
    icon: Truck,
    color: "text-purple-800",
    bgColor: "bg-purple-100",
  },
  entregue: {
    label: "Entregue",
    icon: CheckCircle,
    color: "text-green-800",
    bgColor: "bg-green-100",
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-red-800",
    bgColor: "bg-red-100",
  },
}

export default function AcompanharPedidoPage() {
  const [telefone, setTelefone] = useState("")
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const handleBuscar = async () => {
    if (!telefone.trim()) {
      alert("Por favor, informe seu número de telefone")
      return
    }

    setLoading(true)
    setSearched(true)
    try {
      // Remover formatação para buscar
      const telefoneLimpo = telefone.replace(/\D/g, "")
      const data = await getPedidosPorTelefone(telefoneLimpo)
      setPedidos(data || [])
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error)
      alert("Erro ao buscar pedidos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden w-full">
      <Header />
      <section className="px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-foreground mb-2">Acompanhar meu pedido</h1>
            <p className="text-foreground/60">Digite seu número de telefone para ver seus pedidos</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Buscar pedidos</CardTitle>
              <CardDescription>Informe o número de telefone usado no pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="tel"
                  placeholder="(19) 99831-2853"
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                  className="flex-1"
                />
                <Button onClick={handleBuscar} disabled={loading} className="gap-2">
                  <Search size={16} />
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searched && (
            <div className="space-y-4">
              {pedidos.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-foreground/60 text-lg">Nenhum pedido encontrado para este telefone</p>
                    <p className="text-foreground/40 text-sm mt-2">
                      Verifique se o número está correto ou entre em contato conosco
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pedidos.map((pedido) => {
                  const statusConfig = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.pendente
                  const StatusIcon = statusConfig.icon

                  return (
                    <Card key={pedido.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-1">Pedido #{pedido.id.slice(0, 8)}</CardTitle>
                            <CardDescription className="text-sm">
                              {formatarData(pedido.created_at)}
                            </CardDescription>
                          </div>
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            <StatusIcon size={16} />
                            <span className="text-sm font-semibold">{statusConfig.label}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Itens do pedido */}
                        <div>
                          <h3 className="font-semibold mb-2 text-sm text-foreground/80">Itens do pedido:</h3>
                          <div className="space-y-2">
                            {pedido.itens?.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-foreground/70">
                                  {item.quantidade}x {item.nome}
                                  {item.tamanho && ` (${item.tamanho})`}
                                </span>
                                <span className="text-foreground/70 font-medium">
                                  {formatarValor((item.preco || 0) * (item.quantidade || 1))}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Informações de entrega */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-foreground/50 mb-1">Tipo de entrega</p>
                            <p className="text-sm font-medium capitalize">
                              {pedido.tipo_entrega === "entrega" ? "Entrega" : "Retirada"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground/50 mb-1">Forma de pagamento</p>
                            <p className="text-sm font-medium capitalize">{pedido.forma_pagamento}</p>
                          </div>
                        </div>

                        {/* Endereço de entrega */}
                        {pedido.tipo_entrega === "entrega" && pedido.endereco_entrega && (
                          <div className="pt-4 border-t border-border">
                            <div className="flex items-start gap-2">
                              <MapPin size={16} className="text-foreground/50 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-foreground/50 mb-1">Endereço de entrega</p>
                                <p className="text-sm text-foreground/70">
                                  {pedido.endereco_entrega.rua}, {pedido.endereco_entrega.numero}
                                  {pedido.endereco_entrega.complemento &&
                                    ` - ${pedido.endereco_entrega.complemento}`}
                                  <br />
                                  {pedido.endereco_entrega.bairro} - CEP: {pedido.endereco_entrega.cep}
                                  {pedido.endereco_entrega.regiao && (
                                    <>
                                      <br />
                                      Região: {pedido.endereco_entrega.regiao}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Total */}
                        <div className="pt-4 border-t border-border">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-2xl font-bold text-secondary">{formatarValor(pedido.total)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}

