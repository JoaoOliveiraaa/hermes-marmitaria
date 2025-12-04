"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"

export function CartItems() {
  const { itens, removeItem, updateItem } = useCart()

  if (itens.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 w-full">
      {itens.map((item) => {
        const precoBase = item.tamanho ? item.tamanho.preco : item.prato.preco
        const subtotal = (precoBase + item.adicionais.reduce((sum, a) => sum + a.preco, 0)) * item.quantidade

        return (
          <Card key={item.id} className="p-4 border-secondary w-full max-w-full">
            <div className="flex gap-4 w-full">
              {/* Image */}
              <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-secondary">
                <Image
                  src={item.prato.imagem || "/placeholder.svg"}
                  alt={item.prato.nome}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-medium text-foreground">
                    {item.prato.nome} {item.tamanho && `(${item.tamanho.nome})`}
                  </h3>
                  <p className="text-sm text-foreground/60">R$ {precoBase.toFixed(2)}</p>
                </div>

                {/* Adicionais */}
                {item.adicionais.length > 0 && (
                  <p className="text-xs text-foreground/50">
                    Adicionais: {item.adicionais.map((a) => a.nome).join(", ")}
                  </p>
                )}

                {/* Observações */}
                {item.observacoes && <p className="text-xs text-foreground/50 italic">Obs: {item.observacoes}</p>}
              </div>

              {/* Quantity & Price */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateItem(item.id, item.quantidade - 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantidade}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateItem(item.id, item.quantidade + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus size={14} />
                  </Button>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium text-primary">R$ {subtotal.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:bg-red-50 h-8"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
