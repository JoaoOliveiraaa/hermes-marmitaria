"use client"

import { useState, useEffect } from "react"
import type { Prato, Adicional, Tamanho } from "@/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/context/cart-context"

interface AdicionaisModalProps {
  prato: Prato
  isOpen: boolean
  onClose: () => void
}

const adicionaisDisponiveis: Adicional[] = [
  { id: "1", nome: "Feijão à parte", preco: 2.0 },
  { id: "2", nome: "Arroz extra", preco: 2.5 },
  { id: "3", nome: "Proteína extra", preco: 5.0 },
  { id: "4", nome: "Salada extra", preco: 3.0 },
]

export function AdicionaisModal({ prato, isOpen, onClose }: AdicionaisModalProps) {
  const { addItem } = useCart()
  
  // Garantir que os tamanhos tenham IDs
  const tamanhosComIds = (prato.tamanhos || []).map((t: Tamanho, index: number) => ({
    id: t.id || `tamanho-${prato.id}-${index}`,
    nome: t.nome || "M",
    preco: t.preco || 0,
  }))
  
  const [selectedTamanho, setSelectedTamanho] = useState<Tamanho | undefined>(tamanhosComIds[0])
  const [selectedAdicionais, setSelectedAdicionais] = useState<Adicional[]>([])
  const [observacoes, setObservacoes] = useState("")
  const [quantidade, setQuantidade] = useState(1)

  // Reset quando o modal abrir ou o prato mudar
  useEffect(() => {
    if (isOpen) {
      const tamanhos = (prato.tamanhos || []).map((t: Tamanho, index: number) => ({
        id: t.id || `tamanho-${prato.id}-${index}`,
        nome: t.nome || "M",
        preco: t.preco || 0,
      }))
      setSelectedTamanho(tamanhos[0])
      setSelectedAdicionais([])
      setObservacoes("")
      setQuantidade(1)
    }
  }, [isOpen, prato.id, prato.tamanhos])

  const precoBase = selectedTamanho ? selectedTamanho.preco : prato.preco
  const totalAdicionais = selectedAdicionais.reduce((acc, a) => acc + a.preco, 0)
  const total = (precoBase + totalAdicionais) * quantidade

  const handleToggleAdicional = (adicional: Adicional) => {
    setSelectedAdicionais((prev) =>
      prev.find((a) => a.id === adicional.id) ? prev.filter((a) => a.id !== adicional.id) : [...prev, adicional],
    )
  }

  const handleAddToCart = () => {
    addItem(prato, quantidade, selectedTamanho, selectedAdicionais, observacoes)

    // Reset form
    setSelectedAdicionais([])
    setObservacoes("")
    setQuantidade(1)
    setSelectedTamanho(tamanhosComIds[0])
    onClose()
  }
  
  // Reset quando o modal fechar
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light">{prato.nome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tamanhos */}
          {tamanhosComIds.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Tamanho</label>
              <RadioGroup
                value={selectedTamanho?.id || tamanhosComIds[0]?.id || ""}
                onValueChange={(id) => {
                  const tamanho = tamanhosComIds.find((t) => t.id === id)
                  if (tamanho) {
                    setSelectedTamanho(tamanho)
                  }
                }}
              >
                <div className="space-y-2">
                  {tamanhosComIds.map((tamanho, index) => {
                    const isSelected = selectedTamanho?.id === tamanho.id
                    return (
                      <div
                        key={tamanho.id || index}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border hover:border-primary/50 hover:bg-secondary/5"
                        }`}
                        onClick={() => setSelectedTamanho(tamanho)}
                      >
                        <RadioGroupItem 
                          value={tamanho.id} 
                          id={`tamanho-${tamanho.id || index}`}
                          className={isSelected ? "border-primary" : ""}
                        />
                        <label 
                          htmlFor={`tamanho-${tamanho.id || index}`} 
                          className="flex-1 cursor-pointer"
                        >
                          <div className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {tamanho.nome}
                          </div>
                        </label>
                        <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-primary/80"}`}>
                          R$ {tamanho.preco.toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Quantidade */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quantidade</label>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setQuantidade(Math.max(1, quantidade - 1))}>
                −
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantidade}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantidade(quantidade + 1)}>
                +
              </Button>
            </div>
          </div>

          {/* Adicionais */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Adicionais</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {adicionaisDisponiveis.map((adicional) => (
                <div
                  key={adicional.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-secondary transition-colors"
                >
                  <Checkbox
                    id={`adicional-${adicional.id}`}
                    checked={selectedAdicionais.some((a) => a.id === adicional.id)}
                    onCheckedChange={() => handleToggleAdicional(adicional)}
                  />
                  <label htmlFor={`adicional-${adicional.id}`} className="flex-1 text-sm cursor-pointer">
                    {adicional.nome}
                  </label>
                  <span className="text-sm text-primary font-medium">+R$ {adicional.preco.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Observações</label>
            <Textarea
              placeholder="Ex: Sem cebola, extra tempero..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-secondary space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/60">Prato ({quantidade}x)</span>
              <span>R$ {(precoBase * quantidade).toFixed(2)}</span>
            </div>
            {selectedAdicionais.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/60">Adicionais</span>
                <span>R$ {(totalAdicionais * quantidade).toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between font-medium text-lg">
              <span>Total</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAddToCart}>
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
