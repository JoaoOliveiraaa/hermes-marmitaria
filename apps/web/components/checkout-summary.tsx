"use client"

import { useCart } from "@/context/cart-context"
import { Card } from "@/components/ui/card"

export function CheckoutSummary() {
  const { itens, total, frete } = useCart()

  const subtotal = itens.reduce((acc, item) => {
    const precoBase = item.tamanho ? item.tamanho.preco : item.prato.preco
    const preco = precoBase + item.adicionais.reduce((sum, a) => sum + a.preco, 0)
    return acc + preco * item.quantidade
  }, 0)

  return (
    <Card className="p-4 sm:p-6 border-secondary sticky top-24 space-y-4 w-full max-w-full">
      <h3 className="font-medium text-foreground text-lg">Resumo</h3>

      <div className="border-t border-secondary pt-4 space-y-2">
        {itens.map((item) => {
          const precoBase = item.tamanho ? item.tamanho.preco : item.prato.preco
          const precoUnit = precoBase + item.adicionais.reduce((sum, a) => sum + a.preco, 0)
          const subtotalItem = precoUnit * item.quantidade

          return (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground/70">
                {item.prato.nome} {item.tamanho && `(${item.tamanho.nome})`} x{item.quantidade}
              </span>
              <span className="text-foreground">R$ {subtotalItem.toFixed(2)}</span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-secondary pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        {frete > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Frete</span>
            <span>R$ {frete.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-medium text-lg border-t border-secondary pt-2">
          <span>Total</span>
          <span className="text-primary">R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  )
}
