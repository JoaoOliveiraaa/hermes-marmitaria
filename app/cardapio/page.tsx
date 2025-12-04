"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PratoCard } from "@/components/prato-card"
import { AdicionaisModal } from "@/components/adicionais-modal"
import type { Prato } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPratos, getPratosDoDia } from "@/lib/supabase/queries"

export default function CardapioPage() {
  const [selectedPrato, setSelectedPrato] = useState<Prato | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pratos, setPratos] = useState<Prato[]>([])
  const [bebidas, setBebidas] = useState<Prato[]>([])
  const [doces, setDoces] = useState<Prato[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarPratos = async () => {
      try {
        setLoading(true)
        
        // Obter dia da semana atual
        const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
        const hoje = new Date().getDay()
        const diaSemana = dias[hoje]

        // Buscar todos os pratos do banco
        const todosPratos = await getPratos()
        
        // Buscar pratos do dia (apenas os ativos para hoje)
        const pratosDoDia = await getPratosDoDia(diaSemana)
        const idsPratosDoDia = pratosDoDia.map((p: any) => p?.id).filter(Boolean)

        // Converter dados do banco para o formato esperado
        const pratosFormatados: Prato[] = todosPratos.map((p: any) => {
          // Garantir que os tamanhos tenham IDs
          const tamanhosComIds = (p.tamanhos || []).map((t: any, index: number) => ({
            id: t.id || `tamanho-${p.id}-${index}`,
            nome: t.nome || "M",
            preco: t.preco || 0,
          }))
          
          return {
            id: p.id,
            nome: p.nome,
            descricao: p.descricao || "",
            ingredientes: p.ingredientes || [],
            tamanhos: tamanhosComIds,
            preco: p.preco || (tamanhosComIds[0]?.preco || 0),
            imagem: p.imagem_url || "/placeholder.jpg",
            categoria: p.categoria || "prato",
          }
        })

        // Filtrar pratos do dia (apenas os que estão ativos para hoje)
        // Se não houver pratos do dia configurados, mostrar todos os pratos
        const pratosAtivos = idsPratosDoDia.length > 0
          ? pratosFormatados.filter((p) => p.categoria === "prato" && idsPratosDoDia.includes(p.id))
          : pratosFormatados.filter((p) => p.categoria === "prato")

        // Bebidas e doces sempre aparecem (não dependem de dias)
        const bebidasAtivas = pratosFormatados.filter((p) => p.categoria === "bebida")
        const docesAtivos = pratosFormatados.filter((p) => p.categoria === "doce")

        setPratos(pratosAtivos)
        setBebidas(bebidasAtivas)
        setDoces(docesAtivos)

        // Salvar no localStorage como cache
        localStorage.setItem("hermesPratos", JSON.stringify(pratosFormatados))
      } catch (error) {
        console.error("[Cardápio] Erro ao carregar pratos:", error)
        // Fallback para localStorage se houver erro
        const savedPratos = localStorage.getItem("hermesPratos")
        if (savedPratos) {
          const todosPratos = JSON.parse(savedPratos)
          setPratos(todosPratos.filter((p: Prato) => p.categoria === "prato"))
          setBebidas(todosPratos.filter((p: Prato) => p.categoria === "bebida"))
          setDoces(todosPratos.filter((p: Prato) => p.categoria === "doce"))
        }
      } finally {
        setLoading(false)
      }
    }

    carregarPratos()

    // Recarregar a cada 30 segundos para pegar atualizações
    const interval = setInterval(carregarPratos, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleAddToCart = (prato: Prato) => {
    setSelectedPrato(prato)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden w-full">
      <Header />

      <section className="px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-6xl mx-auto w-full">
          {/* Section Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-light text-foreground mb-2">Cardápio do Dia</h1>
            <p className="text-lg text-foreground/60">Escolha suas marmitas frescas e aproveite a melhor qualidade</p>
          </div>

          {/* Tabs */}
          {loading ? (
            <div className="text-center py-12 text-foreground/60">Carregando cardápio...</div>
          ) : (
            <Tabs defaultValue="pratos" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                <TabsTrigger value="pratos">Pratos ({pratos.length})</TabsTrigger>
                <TabsTrigger value="bebidas">Bebidas ({bebidas.length})</TabsTrigger>
                <TabsTrigger value="doces">Doces ({doces.length})</TabsTrigger>
              </TabsList>

            {/* Pratos Tab */}
            <TabsContent value="pratos" className="space-y-6">
              {pratos.length === 0 ? (
                <div className="text-center py-12 text-foreground/60">Nenhum prato disponível no momento</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pratos.map((prato) => (
                    <PratoCard key={prato.id} prato={prato} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Bebidas Tab */}
            <TabsContent value="bebidas" className="space-y-6">
              {bebidas.length === 0 ? (
                <div className="text-center py-12 text-foreground/60">Nenhuma bebida disponível no momento</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bebidas.map((bebida) => (
                    <PratoCard key={bebida.id} prato={bebida} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Doces Tab */}
            <TabsContent value="doces" className="space-y-6">
              {doces.length === 0 ? (
                <div className="text-center py-12 text-foreground/60">Nenhum doce disponível no momento</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doces.map((doce) => (
                    <PratoCard key={doce.id} prato={doce} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          )}
        </div>
      </section>

      {/* Adicionais Modal */}
      {selectedPrato && (
        <AdicionaisModal prato={selectedPrato} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}

      <Footer />
    </main>
  )
}
