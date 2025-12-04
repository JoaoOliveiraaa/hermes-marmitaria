"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { LogOut, Edit2, Trash2, Plus } from "lucide-react"
import {
  getPratos,
  createPrato,
  updatePrato,
  deletePrato,
  getPedidos,
  updatePedidoStatus,
  getFretes,
  getHorarios,
  getPratosDiasAssociacao,
  criarAssociacaoPratosDia,
  atualizarStatusPratoDia,
} from "@/lib/supabase/queries"
import { uploadImageToBlob } from "@/lib/supabase/blob-upload"
import type { Prato, Pedido, Tamanho } from "@/types"

const ADMIN_CREDENTIALS = {
  email: "admin@hermesmarmitaria.com",
  senha: "hermes2025",
}

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(true)
  const [loginAttempted, setLoginAttempted] = useState(false)

  const [pratos, setPratos] = useState<Prato[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [fretes, setFretes] = useState<any[]>([])
  const [horarios, setHorarios] = useState<any[]>([])
  const [pratosDias, setPratosDias] = useState<any[]>([])

  const [editingPrato, setEditingPrato] = useState<Prato | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newPrato, setNewPrato] = useState({
    nome: "",
    descricao: "",
    imagem_url: "",
    categoria: "prato" as "prato" | "bebida" | "doce",
    tamanhos: [{ id: `tamanho-${Date.now()}-0`, nome: "M", preco: 0 }] as Tamanho[],
    preco: 0,
    diasSelecionados: [] as string[],
  })

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    const carregarDados = async () => {
      await Promise.all([
        carregarPratos(),
        carregarPedidos(),
        carregarFretes(),
        carregarHorarios(),
        carregarPratosDias(),
      ])
    }

    carregarDados()
    const interval = setInterval(carregarDados, 2000)
    window.addEventListener("storage", carregarDados)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", carregarDados)
    }
  }, [isAuthenticated])

  const carregarPratos = async () => {
    const data = await getPratos()
    setPratos(data)
  }

  const carregarPedidos = async () => {
    const data = await getPedidos()
    // Mapear dados do banco para o formato esperado pelo componente
    const pedidosMapeados = data.map((pedido: any) => ({
      ...pedido,
      nomeCliente: pedido.cliente_nome || pedido.nomeCliente || "Cliente",
      telefoneCliente: pedido.cliente_telefone || pedido.telefoneCliente || "",
    }))
    setPedidos(pedidosMapeados)
  }

  const carregarFretes = async () => {
    const data = await getFretes()
    setFretes(data)
  }

  const carregarHorarios = async () => {
    const data = await getHorarios()
    setHorarios(data)
  }

  const carregarPratosDias = async () => {
    const data = await getPratosDiasAssociacao()
    setPratosDias(data)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginAttempted(true)

    if (email === ADMIN_CREDENTIALS.email && senha === ADMIN_CREDENTIALS.senha) {
      setIsAuthenticated(true)
      localStorage.setItem("hermesAdminAuth", "true")
    } else {
      alert("Email ou senha incorretos")
      setSenha("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("hermesAdminAuth")
    setEmail("")
    setSenha("")
    setLoginAttempted(false)
    setPratos([])
    setPedidos([])
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const imageUrl = await uploadImageToBlob(file)
      setNewPrato({ ...newPrato, imagem_url: imageUrl })
    } catch (error) {
      alert("Erro ao fazer upload da imagem")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddPrato = async () => {
    if (!newPrato.nome.trim()) {
      alert("Nome é obrigatório")
      return
    }

    // Para pratos, é obrigatório selecionar dias
    if (newPrato.categoria === "prato" && newPrato.diasSelecionados.length === 0) {
      alert("Selecione pelo menos um dia para este prato")
      return
    }

    // Para bebidas e doces, usar preço único se não tiver tamanhos
    const precoFinal = newPrato.categoria === "prato" 
      ? (newPrato.tamanhos[0]?.preco || 0)
      : (newPrato.preco || 0)

    // Garantir que os tamanhos tenham IDs antes de salvar
    const tamanhosComIds = newPrato.categoria === "prato" 
      ? newPrato.tamanhos.map((t, idx) => ({
          id: t.id || `tamanho-${Date.now()}-${idx}`,
          nome: t.nome,
          preco: t.preco,
        }))
      : []

    const pratoData: any = {
      nome: newPrato.nome,
      descricao: newPrato.descricao || "",
      imagem_url: newPrato.imagem_url || "",
      categoria: newPrato.categoria,
      tamanhos: tamanhosComIds,
      preco: precoFinal,
    }

    try {
      const created = await createPrato(pratoData)
      if (created) {
        // Só criar associação de dias para pratos
        if (newPrato.categoria === "prato" && newPrato.diasSelecionados.length > 0) {
          await criarAssociacaoPratosDia(created.id, newPrato.diasSelecionados)
        }

        setNewPrato({
          nome: "",
          descricao: "",
          imagem_url: "",
          categoria: "prato",
          tamanhos: [{ id: `tamanho-${Date.now()}-0`, nome: "M", preco: 0 }],
          preco: 0,
          diasSelecionados: [],
        })
        await Promise.all([carregarPratos(), carregarPratosDias()])
        alert("Prato cadastrado com sucesso!")
      } else {
        alert("Erro ao cadastrar prato. Tente novamente.")
      }
    } catch (error) {
      console.error("[Admin] Erro ao criar prato:", error)
      alert(`Erro ao cadastrar prato: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    }
  }

  const handleUpdatePrato = async () => {
    if (!editingPrato) return

    const updated = await updatePrato(editingPrato.id, editingPrato)
    if (updated) {
      setEditingPrato(null)
      await carregarPratos()
    }
  }

  const handleDeletePrato = async (id: string) => {
    if (confirm("Deseja deletar este prato? Ele será removido de todos os dias.")) {
      await deletePrato(id)
      await Promise.all([carregarPratos(), carregarPratosDias()])
    }
  }

  const handleTogglePratoDia = async (prato_id: string, dia: string) => {
    const associacao = pratosDias.find((pd) => pd.prato_id === prato_id && pd.dia_semana === dia)
    const novoStatus = !associacao?.ativo

    await atualizarStatusPratoDia(prato_id, dia, novoStatus)
    await carregarPratosDias()
  }

  const handleUpdatePedidoStatus = async (pedidoId: string, novoStatus: string) => {
    const pedido = pedidos.find((p) => p.id === pedidoId)
    if (!pedido) return

    await updatePedidoStatus(pedidoId, novoStatus)

    const telefoneCliente = (pedido.telefoneCliente || (pedido as any).cliente_telefone || "").replace(/\D/g, "")
    const nomeCliente = pedido.nomeCliente || (pedido as any).cliente_nome || "Cliente"
    
    if (telefoneCliente && novoStatus !== "cancelado") {
      const mensagens: { [key: string]: string } = {
        preparando: `Olá ${nomeCliente}! Seu pedido está sendo preparado! 👨‍🍳`,
        pronto: `Olá ${nomeCliente}! Seu pedido está pronto! 🎉`,
        entrega: `Seu pedido saiu para entrega! Chegará em breve! 🚗`,
        entregue: `Obrigado pelo pedido, ${nomeCliente}! Volte sempre! 😊`,
      }

      const mensagem = mensagens[novoStatus] || `Pedido atualizado: ${novoStatus}`
      const url = `https://wa.me/55${telefoneCliente}?text=${encodeURIComponent(mensagem)}`

      window.open(url, "_blank")
    }
    
    await carregarPedidos()
  }

  if (loading) return null

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background overflow-x-hidden w-full">
        <Header />
        <section className="px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-light text-foreground mb-2">Painel Admin</h1>
              <p className="text-foreground/60">Acesse a área administrativa</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 bg-card p-8 rounded-lg border border-border">
              <div>
                <label className="text-sm font-medium block mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hermesmarmitaria.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Senha</label>
                <Input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              {loginAttempted && (
                <p className="text-xs text-foreground/40 text-center">Demo: admin@hermesmarmitaria.com / hermes2025</p>
              )}
            </form>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden w-full">
      <Header />
      <section className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-light text-foreground">Painel Administrativo</h1>
              <p className="text-foreground/60 text-sm mt-1">Bem-vindo, {email.split("@")[0]}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut size={16} /> Sair
            </Button>
          </div>

          <Tabs defaultValue="pedidos" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pedidos">Pedidos ({pedidos.length})</TabsTrigger>
              <TabsTrigger value="cardapio">Pratos ({pratos.filter(p => p.categoria === "prato").length})</TabsTrigger>
              <TabsTrigger value="bebidas-doces">Bebidas & Doces ({pratos.filter(p => p.categoria === "bebida" || p.categoria === "doce").length})</TabsTrigger>
              <TabsTrigger value="dias">Pratos por Dia</TabsTrigger>
            </TabsList>

            {/* ABA PEDIDOS */}
            <TabsContent value="pedidos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pedidos Recentes</CardTitle>
                  <CardDescription>Gerencie o status dos pedidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {pedidos.length === 0 ? (
                      <p className="text-foreground/60">Nenhum pedido ainda</p>
                    ) : (
                      pedidos.map((pedido) => (
                        <div key={pedido.id} className="p-4 border border-border rounded-lg space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{pedido.nomeCliente}</p>
                              <p className="text-sm text-foreground/60">ID: {pedido.id}</p>
                              <p className="text-sm text-foreground/60">Tel: {pedido.telefoneCliente}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                pedido.status === "pendente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : pedido.status === "preparando"
                                    ? "bg-blue-100 text-blue-800"
                                    : pedido.status === "pronto"
                                      ? "bg-green-100 text-green-800"
                                      : pedido.status === "cancelado"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {pedido.status}
                            </span>
                          </div>
                          <p className="text-sm">Total: R$ {pedido.total.toFixed(2)}</p>
                          <div className="flex gap-2 flex-wrap">
                            {["preparando", "pronto", "entrega", "entregue"].map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdatePedidoStatus(pedido.id, status)}
                                disabled={pedido.status === status || pedido.status === "cancelado"}
                              >
                                {status}
                              </Button>
                            ))}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdatePedidoStatus(pedido.id, "cancelado")}
                              disabled={pedido.status === "cancelado"}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA CARDÁPIO */}
            <TabsContent value="cardapio" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Novo Prato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Categoria</label>
                    <select
                      value={newPrato.categoria}
                      onChange={(e) => {
                        const categoria = e.target.value as "prato" | "bebida" | "doce"
                        setNewPrato({
                          ...newPrato,
                          categoria,
                          tamanhos: categoria === "prato" ? [{ id: `tamanho-${Date.now()}-0`, nome: "M", preco: 0 }] : [],
                          preco: categoria !== "prato" ? newPrato.preco : 0,
                        })
                      }}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="prato">Prato</option>
                      <option value="bebida">Bebida</option>
                      <option value="doce">Doce</option>
                    </select>
                  </div>
                  <Input
                    placeholder="Nome"
                    value={newPrato.nome}
                    onChange={(e) => setNewPrato({ ...newPrato, nome: e.target.value })}
                  />
                  <Input
                    placeholder="Descrição"
                    value={newPrato.descricao}
                    onChange={(e) => setNewPrato({ ...newPrato, descricao: e.target.value })}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Imagem do Prato</label>
                    <div className="flex gap-2">
                      <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                      {uploadingImage && <span className="text-sm text-foreground/60">Enviando...</span>}
                    </div>
                    {newPrato.imagem_url && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                        <img
                          src={newPrato.imagem_url || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {newPrato.categoria === "prato" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Dias que este prato estará disponível</label>
                        <div className="grid grid-cols-2 gap-2">
                          {DIAS_SEMANA.map((dia) => (
                            <div key={dia} className="flex items-center gap-2">
                              <Checkbox
                                checked={newPrato.diasSelecionados.includes(dia)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewPrato({
                                      ...newPrato,
                                      diasSelecionados: [...newPrato.diasSelecionados, dia],
                                    })
                                  } else {
                                    setNewPrato({
                                      ...newPrato,
                                      diasSelecionados: newPrato.diasSelecionados.filter((d) => d !== dia),
                                    })
                                  }
                                }}
                              />
                              <label className="text-sm">{dia}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tamanhos</label>
                        {newPrato.tamanhos.map((tamanho, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              placeholder="Tamanho (P, M, G)"
                              value={tamanho.nome}
                              onChange={(e) => {
                                const updated = [...newPrato.tamanhos]
                                updated[idx].nome = e.target.value
                                setNewPrato({ ...newPrato, tamanhos: updated })
                              }}
                            />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Preço"
                              value={tamanho.preco}
                              onChange={(e) => {
                                const updated = [...newPrato.tamanhos]
                                updated[idx].preco = Number.parseFloat(e.target.value) || 0
                                setNewPrato({ ...newPrato, tamanhos: updated })
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setNewPrato({
                              ...newPrato,
                              tamanhos: [...newPrato.tamanhos, { 
                                id: `tamanho-${Date.now()}-${newPrato.tamanhos.length}`,
                                nome: "", 
                                preco: 0 
                              }],
                            })
                          }
                        >
                          <Plus size={16} /> Adicionar Tamanho
                        </Button>
                      </div>
                    </>
                  )}

                  {(newPrato.categoria === "bebida" || newPrato.categoria === "doce") && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preço</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Preço (R$)"
                        value={newPrato.preco}
                        onChange={(e) => setNewPrato({ ...newPrato, preco: Number.parseFloat(e.target.value) || 0 })}
                      />
                      <p className="text-xs text-foreground/60">
                        Bebidas e doces ficam sempre disponíveis no cardápio
                      </p>
                    </div>
                  )}

                  <Button onClick={handleAddPrato} className="w-full">
                    Adicionar {newPrato.categoria === "prato" ? "Prato" : newPrato.categoria === "bebida" ? "Bebida" : "Doce"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pratos Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pratos.filter(p => p.categoria === "prato").length === 0 ? (
                      <p className="text-foreground/60">Nenhum prato cadastrado</p>
                    ) : (
                      pratos.filter(p => p.categoria === "prato").map((prato) => (
                        <div
                          key={prato.id}
                          className="p-4 border border-border rounded-lg flex justify-between items-start gap-4"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">{prato.nome}</p>
                            <p className="text-sm text-foreground/60">{prato.descricao}</p>
                            <div className="text-sm mt-1">
                              {prato.tamanhos?.map((t) => (
                                <span key={t.nome} className="inline-block mr-2">
                                  {t.nome}: R$ {t.preco.toFixed(2)}
                                </span>
                              ))}
                            </div>
                            {prato.imagem_url && (
                              <img
                                src={prato.imagem_url || "/placeholder.svg"}
                                alt={prato.nome}
                                className="w-20 h-20 object-cover rounded mt-2"
                              />
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingPrato(prato)}>
                              <Edit2 size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeletePrato(prato.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA BEBIDAS E DOCES */}
            <TabsContent value="bebidas-doces" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Bebida ou Doce</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Tipo</label>
                    <select
                      value={newPrato.categoria}
                      onChange={(e) => {
                        const categoria = e.target.value as "bebida" | "doce"
                        setNewPrato({
                          ...newPrato,
                          categoria,
                          preco: 0,
                        })
                      }}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="bebida">Bebida</option>
                      <option value="doce">Doce</option>
                    </select>
                  </div>
                  <Input
                    placeholder="Nome"
                    value={newPrato.nome}
                    onChange={(e) => setNewPrato({ ...newPrato, nome: e.target.value })}
                  />
                  <Input
                    placeholder="Descrição"
                    value={newPrato.descricao}
                    onChange={(e) => setNewPrato({ ...newPrato, descricao: e.target.value })}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Imagem</label>
                    <div className="flex gap-2">
                      <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                      {uploadingImage && <span className="text-sm text-foreground/60">Enviando...</span>}
                    </div>
                    {newPrato.imagem_url && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                        <img
                          src={newPrato.imagem_url || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preço</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Preço (R$)"
                      value={newPrato.preco}
                      onChange={(e) => setNewPrato({ ...newPrato, preco: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <Button onClick={handleAddPrato} className="w-full">
                    Adicionar {newPrato.categoria === "bebida" ? "Bebida" : "Doce"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bebidas e Doces Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pratos.filter(p => p.categoria === "bebida" || p.categoria === "doce").length === 0 ? (
                      <p className="text-foreground/60">Nenhuma bebida ou doce cadastrado</p>
                    ) : (
                      pratos.filter(p => p.categoria === "bebida" || p.categoria === "doce").map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border border-border rounded-lg flex justify-between items-start gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{item.nome}</p>
                              <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                                {item.categoria}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/60">{item.descricao}</p>
                            <p className="text-sm mt-1 font-medium text-primary">
                              R$ {item.preco.toFixed(2)}
                            </p>
                            {item.imagem_url && (
                              <img
                                src={item.imagem_url || "/placeholder.svg"}
                                alt={item.nome}
                                className="w-20 h-20 object-cover rounded mt-2"
                              />
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingPrato(item)}>
                              <Edit2 size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeletePrato(item.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dias" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Pratos por Dia</CardTitle>
                  <CardDescription>Ative ou desative pratos para cada dia da semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DIAS_SEMANA.map((dia) => {
                      const pratos_do_dia = pratosDias.filter((pd) => pd.dia_semana === dia)
                      return (
                        <div key={dia} className="p-4 border border-border rounded-lg">
                          <h3 className="font-semibold mb-3">{dia}</h3>
                          <div className="space-y-2">
                            {pratos_do_dia.length === 0 ? (
                              <p className="text-sm text-foreground/60">Nenhum prato cadastrado para este dia</p>
                            ) : (
                              pratos_do_dia.map((pd) => {
                                const prato = pratos.find((p) => p.id === pd.prato_id)
                                return (
                                  <div key={pd.id} className="flex items-center gap-3 p-2 bg-background rounded">
                                    <Checkbox
                                      checked={pd.ativo}
                                      onCheckedChange={() => handleTogglePratoDia(pd.prato_id, dia)}
                                    />
                                    <span className={pd.ativo ? "" : "line-through text-foreground/50"}>
                                      {prato?.nome}
                                    </span>
                                  </div>
                                )
                              })
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </main>
  )
}
