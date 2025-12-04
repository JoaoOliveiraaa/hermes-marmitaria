"use client"

import type { Prato } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface PratoCardProps {
  prato: Prato
  onAddToCart: (prato: Prato) => void
}

export function PratoCard({ prato, onAddToCart }: PratoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-secondary">
      <div className="relative h-48 bg-secondary overflow-hidden">
        <Image src={prato.imagem || "/placeholder.svg"} alt={prato.nome} fill className="object-cover" />
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-medium text-lg text-foreground mb-1">{prato.nome}</h3>
          <p className="text-sm text-foreground/60 line-clamp-2">{prato.descricao}</p>
        </div>

        {/* Ingredientes */}
        {prato.ingredientes && prato.ingredientes.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-foreground/50">Ingredientes</p>
            <p className="text-sm text-foreground/70">
              {prato.ingredientes.slice(0, 2).join(", ")}
              {prato.ingredientes.length > 2 && "..."}
            </p>
          </div>
        )}

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-2 border-t border-secondary">
          <span className="text-xl font-light text-primary">R$ {prato.preco.toFixed(2)}</span>
          <Button onClick={() => onAddToCart(prato)} size="sm" className="bg-primary hover:bg-primary/90">
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
