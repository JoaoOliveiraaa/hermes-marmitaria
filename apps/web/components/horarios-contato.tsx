"use client"

import { Phone, MapPin, Clock, Mail, MessageCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const horarios = [
  { dia: "Segunda-feira", abertura: "10:00", fechamento: "19:00", aberto: true },
  { dia: "Terça-feira", abertura: "10:00", fechamento: "19:00", aberto: true },
  { dia: "Quarta-feira", abertura: "10:00", fechamento: "19:00", aberto: true },
  { dia: "Quinta-feira", abertura: "10:00", fechamento: "19:00", aberto: true },
  { dia: "Sexta-feira", abertura: "10:00", fechamento: "19:00", aberto: true },
  { dia: "Sábado", abertura: "10:00", fechamento: "15:00", aberto: true },
  { dia: "Domingo", abertura: "Fechado", fechamento: "", aberto: false },
]

export function HorariosContato() {
  const hoje = new Date().getDay()
  const hojeHorario = horarios[hoje === 0 ? 6 : hoje - 1]

  return (
    <section id="horarios" className="px-4 sm:px-6 lg:px-8 py-20 bg-foreground text-background w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-light mb-2">Horários de Funcionamento</h2>
          <p className="text-background/70">Aberto para servir você com qualidade</p>
        </div>

        {/* Horários */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h3 className="text-2xl font-light flex items-center justify-center gap-2 mb-6">
            <Clock size={24} className="text-primary" />
            Nossos Horários
          </h3>

          {/* Status Atual */}
          <Card className="p-4 border-primary/30 bg-primary/10 mb-6">
            <p className="text-sm text-background/80 text-center">
              <span className="font-medium">Status Atual:</span>{" "}
              {hojeHorario.aberto ? (
                <span className="text-green-400 font-medium">Aberto agora</span>
              ) : (
                <span className="text-red-400 font-medium">Fechado no momento</span>
              )}
            </p>
          </Card>

          {/* Tabela de Horários */}
          <div className="space-y-3">
            {horarios.map((h, idx) => (
              <div
                key={h.dia}
                className={`flex justify-between items-center p-4 rounded-lg border-2 transition-all ${
                  idx === (hoje === 0 ? 6 : hoje - 1)
                    ? "bg-primary/20 border-primary shadow-lg scale-105"
                    : "bg-background/10 border-background/20 hover:border-primary/30"
                }`}
              >
                <span className={`text-lg ${idx === (hoje === 0 ? 6 : hoje - 1) ? "font-semibold" : ""}`}>
                  {h.dia}
                </span>
                <span className={`text-lg font-medium ${idx === (hoje === 0 ? 6 : hoje - 1) ? "text-primary" : "text-background/70"}`}>
                  {h.aberto ? `${h.abertura} - ${h.fechamento}` : h.abertura}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
