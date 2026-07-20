"use client"

import { useCart } from "@/context/cart-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

const freteOpcoes = [
  { id: "0", nome: "Retirada no balcão", valor: 0 },
  { id: "1", nome: "Entrega - Analândia", valor: 5.0 },
]

export function CartSummary() {
  const { itens, total, frete, setFrete } = useCart()
  const [tipoEntrega, setTipoEntrega] = useState("0")

  const subtotal = itens.reduce((acc, item) => {
    const preco = item.prato.preco + item.adicionais.reduce((sum, a) => sum + a.preco, 0)
    return acc + preco * item.quantidade
  }, 0)

  const handleTipoEntregaChange = (value: string) => {
    setTipoEntrega(value)
    const selected = freteOpcoes.find((f) => f.id === value)
    setFrete(selected?.valor || 0)
  }

  return (
    <Card className="p-4 sm:p-6 border-secondary sticky top-24 space-y-6 w-full max-w-full">
      {/* Tipo Entrega */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tipo de Entrega</label>
        <Select value={tipoEntrega} onValueChange={handleTipoEntregaChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {freteOpcoes.map((opcao) => (
              <SelectItem key={opcao.id} value={opcao.id}>
                {opcao.nome} {opcao.valor > 0 && `- R$ ${opcao.valor.toFixed(2)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Divider */}
      <div className="border-t border-secondary"></div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Subtotal</span>
          <span className="text-foreground">R$ {subtotal.toFixed(2)}</span>
        </div>
        {frete > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Frete</span>
            <span className="text-foreground">R$ {frete.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-medium text-lg pt-2 border-t border-secondary">
          <span>Total</span>
          <span className="text-primary">R$ {(subtotal + frete).toFixed(2)}</span>
        </div>
      </div>

      {/* CTA */}
      <Link href="/checkout" className="block">
        <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-base">Continuar para Pagamento</Button>
      </Link>

      <Link href="/cardapio" className="block">
        <Button variant="outline" className="w-full bg-transparent">
          Continuar Comprando
        </Button>
      </Link>
    </Card>
  )
}
