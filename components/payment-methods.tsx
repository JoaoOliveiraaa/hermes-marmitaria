"use client"

import { Card } from "@/components/ui/card"
import { DollarSign, CreditCard, Smartphone, Ticket, Gift, MessageCircle } from "lucide-react"
import Link from "next/link"

interface PaymentMethodsProps {
  selected: string | null
  onSelect: (method: string) => void
}

const paymentMethods = [
  {
    id: "dinheiro",
    nome: "Dinheiro",
    descricao: "Pagamento em dinheiro",
    icon: DollarSign,
  },
  {
    id: "pix",
    nome: "Pix",
    descricao: "brunogoncalves011@gmail.com",
    icon: Smartphone,
    nota: "Enviar comprovante para liberação do pedido",
    whatsapp: "5519998312853",
  },
  {
    id: "credito",
    nome: "Cartão de Crédito",
    descricao: "Visa, Mastercard, Hipercard, Amex, Elo",
    icon: CreditCard,
  },
  {
    id: "debito",
    nome: "Cartão de Débito",
    descricao: "Visa, Mastercard, Hipercard, Amex, Elo",
    icon: CreditCard,
  },
  {
    id: "sodexo",
    nome: "Sodexo",
    descricao: "Cartão Sodexo",
    icon: Ticket,
  },
  {
    id: "ticket",
    nome: "Ticket",
    descricao: "Cartão Ticket",
    icon: Ticket,
  },
  {
    id: "vegas",
    nome: "Vegas",
    descricao: "Cartão Vegas",
    icon: Gift,
  },
  {
    id: "vr",
    nome: "Cartão VR",
    descricao: "Cartão de Refeição VR",
    icon: Ticket,
  },
  {
    id: "alelo",
    nome: "Cartão Alelo",
    descricao: "Cartão Alelo",
    icon: Ticket,
  },
]

export function PaymentMethods({ selected, onSelect }: PaymentMethodsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {paymentMethods.map((method) => {
        const Icon = method.icon
        const isSelected = selected === method.id

        return (
          <Card
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`p-4 cursor-pointer transition-all border-2 ${
              isSelected ? "border-primary bg-primary/5" : "border-secondary hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/10" : "bg-secondary"}`}>
                <Icon size={20} className={isSelected ? "text-primary" : "text-foreground/60"} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{method.nome}</h3>
                <p className="text-sm text-foreground/60 line-clamp-1">{method.descricao}</p>
                {method.nota && (
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-primary/70 italic">{method.nota}</p>
                    {method.whatsapp && (
                      <Link
                        href={`https://wa.me/${method.whatsapp}?text=Olá! Gostaria de enviar o comprovante do pagamento PIX do meu pedido.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
                        Enviar comprovante via WhatsApp
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
