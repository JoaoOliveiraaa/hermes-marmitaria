"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PaymentMethods } from "@/components/payment-methods"
import { CheckoutSummary } from "@/components/checkout-summary"
import { useCart } from "@/context/cart-context"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getFretes } from "@/lib/supabase/queries"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CheckoutPage() {
  const { itens, total, criarPedido, setFrete, frete } = useCart()
  const router = useRouter()
  const [nomeCliente, setNomeCliente] = useState("")
  const [telefoneCliente, setTelefoneCliente] = useState("")

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  const [observacoesPedido, setObservacoesPedido] = useState("")
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<string | null>(null)
  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirada">("entrega")
  const [isProcessing, setIsProcessing] = useState(false)
  const [erro, setErro] = useState("")
  
  // Campos de endereço
  const [endereco, setEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cep: "",
    complemento: "",
    regiao: "",
  })
  
  const [fretesDisponiveis, setFretesDisponiveis] = useState<Array<{ id: string; regiao: string; valor: number }>>([])
  const [loadingFretes, setLoadingFretes] = useState(true)

  // Carregar fretes disponíveis
  useEffect(() => {
    const carregarFretes = async () => {
      try {
        const fretes = await getFretes()
        setFretesDisponiveis(fretes)
      } catch (error) {
        console.error("[Checkout] Erro ao carregar fretes:", error)
      } finally {
        setLoadingFretes(false)
      }
    }
    carregarFretes()
  }, [])

  // Calcular frete quando tipo de entrega ou região mudar
  useEffect(() => {
    if (tipoEntrega === "retirada") {
      setFrete(0)
    } else if (tipoEntrega === "entrega" && endereco.regiao) {
      const freteSelecionado = fretesDisponiveis.find((f) => f.regiao === endereco.regiao)
      if (freteSelecionado) {
        setFrete(freteSelecionado.valor)
      } else {
        // Se não encontrar a região, usar o primeiro frete disponível ou 0
        setFrete(fretesDisponiveis[0]?.valor || 0)
      }
    } else if (tipoEntrega === "entrega" && !endereco.regiao) {
      setFrete(0)
    }
  }, [tipoEntrega, endereco.regiao, fretesDisponiveis, setFrete])

  if (itens.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-light text-foreground">Carrinho Vazio</h1>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const handleConfirmPedido = async () => {
    if (!nomeCliente.trim()) {
      setErro("Por favor, insira seu nome")
      return
    }
    if (!telefoneCliente.trim()) {
      setErro("Por favor, insira seu telefone")
      return
    }
    if (!pagamentoSelecionado) {
      setErro("Selecione uma forma de pagamento")
      return
    }
    
    // Validar endereço se for entrega
    if (tipoEntrega === "entrega") {
      if (!endereco.rua.trim()) {
        setErro("Por favor, insira a rua do endereço de entrega")
        return
      }
      if (!endereco.numero.trim()) {
        setErro("Por favor, insira o número do endereço de entrega")
        return
      }
      if (!endereco.bairro.trim()) {
        setErro("Por favor, insira o bairro do endereço de entrega")
        return
      }
      if (!endereco.regiao) {
        setErro("Por favor, selecione a região para calcular o frete")
        return
      }
    }

    setIsProcessing(true)
    setErro("")

    try {
      await criarPedido(
        nomeCliente,
        telefoneCliente,
        pagamentoSelecionado,
        tipoEntrega,
        observacoesPedido,
        tipoEntrega === "entrega" ? endereco : undefined
      )
      router.push("/pedido-confirmado")
    } catch (error) {
      setErro("Erro ao processar pedido. Tente novamente.")
      console.error("[v0] Erro:", error)
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden w-full">
      <Header />

      <section className="px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-4xl font-light text-foreground mb-12">Finalizar Pedido</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-foreground">Seus Dados</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Nome Completo</label>
                    <Input
                      placeholder="Seu nome"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Telefone</label>
                    <Input
                      type="tel"
                      placeholder="(19) 99831-2853"
                      value={telefoneCliente}
                      onChange={(e) => setTelefoneCliente(formatarTelefone(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de Entrega */}
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-foreground">Tipo de Entrega</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setTipoEntrega("retirada")
                      setFrete(0)
                    }}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      tipoEntrega === "retirada" ? "border-primary bg-primary/10" : "border-border bg-card"
                    }`}
                  >
                    <div className="font-medium">Retirada</div>
                    <div className="text-sm text-foreground/60">No balcão - Grátis</div>
                  </button>
                  <button
                    onClick={() => setTipoEntrega("entrega")}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      tipoEntrega === "entrega" ? "border-primary bg-primary/10" : "border-border bg-card"
                    }`}
                  >
                    <div className="font-medium">Entrega</div>
                    <div className="text-sm text-foreground/60">Em Analândia</div>
                  </button>
                </div>
              </div>

              {/* Endereço de Entrega */}
              {tipoEntrega === "entrega" && (
                <div className="space-y-4 p-6 border border-border rounded-lg bg-card">
                  <h2 className="text-2xl font-light text-foreground">Endereço de Entrega</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-foreground block mb-2">Rua *</label>
                      <Input
                        placeholder="Nome da rua"
                        value={endereco.rua}
                        onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Número *</label>
                      <Input
                        placeholder="Número"
                        value={endereco.numero}
                        onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Complemento</label>
                      <Input
                        placeholder="Apto, bloco, etc (opcional)"
                        value={endereco.complemento}
                        onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Bairro *</label>
                      <Input
                        placeholder="Bairro"
                        value={endereco.bairro}
                        onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">CEP</label>
                      <Input
                        placeholder="13550-000"
                        value={endereco.cep}
                        onChange={(e) => {
                          const cep = e.target.value.replace(/\D/g, "")
                          const formatted = cep.replace(/(\d{5})(\d{3})/, "$1-$2")
                          setEndereco({ ...endereco, cep: formatted })
                        }}
                        maxLength={9}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-foreground block mb-2">Região *</label>
                      {loadingFretes ? (
                        <div className="text-sm text-foreground/60">Carregando regiões...</div>
                      ) : (
                        <Select
                          value={endereco.regiao}
                          onValueChange={(value) => {
                            setEndereco({ ...endereco, regiao: value })
                            const freteSelecionado = fretesDisponiveis.find((f) => f.regiao === value)
                            if (freteSelecionado) {
                              setFrete(freteSelecionado.valor)
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a região" />
                          </SelectTrigger>
                          <SelectContent>
                            {fretesDisponiveis.map((frete) => (
                              <SelectItem key={frete.id} value={frete.regiao}>
                                {frete.regiao} - R$ {frete.valor.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {endereco.regiao && (
                        <p className="text-xs text-foreground/60 mt-1">
                          Frete: R$ {frete.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Observações */}
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-foreground">Observações do Pedido</h2>
                <Textarea
                  placeholder="Ex: Sem sal, extra molho, etc..."
                  value={observacoesPedido}
                  onChange={(e) => setObservacoesPedido(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Formas de Pagamento */}
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-foreground">Forma de Pagamento</h2>
                <PaymentMethods selected={pagamentoSelecionado} onSelect={setPagamentoSelecionado} />
              </div>

              {erro && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{erro}</p>
                </div>
              )}

              <Button
                onClick={handleConfirmPedido}
                disabled={
                  isProcessing || 
                  !pagamentoSelecionado || 
                  !nomeCliente || 
                  !telefoneCliente ||
                  (tipoEntrega === "entrega" && (!endereco.rua || !endereco.numero || !endereco.bairro || !endereco.regiao))
                }
                className="w-full bg-primary hover:bg-primary/90 py-6 text-base"
              >
                {isProcessing ? "Processando..." : "Confirmar Pedido"}
              </Button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
