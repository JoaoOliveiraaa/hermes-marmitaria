"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function PedidoConfirmadoPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background overflow-x-hidden w-full">
      <Header />

      <section className="px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-2xl mx-auto text-center space-y-6 animate-slide-up w-full">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-4xl font-light text-foreground mb-2">Pedido Confirmado!</h1>
            <p className="text-xl text-foreground/60">Seu pedido foi enviado para preparo</p>
          </div>

          <div className="bg-secondary rounded-lg p-6 text-left space-y-3">
            <p className="text-sm text-foreground/60">Você receberá atualizações em breve!</p>
            <p className="text-xs text-foreground/50">Acompanhe seu pedido pelo telefone fornecido.</p>
          </div>

          <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90 px-8 py-3">
            Voltar à Home
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
