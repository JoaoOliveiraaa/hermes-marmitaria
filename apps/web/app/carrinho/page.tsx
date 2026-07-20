"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
import { useCart } from "@/context/cart-context"
import Link from "next/link"

export default function CarrinhoPage() {
  const { itens } = useCart()

  if (itens.length === 0) {
    return (
      <main className="min-h-screen bg-background overflow-x-hidden w-full">
        <Header />

        <section className="px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl mx-auto text-center space-y-6 w-full">
            <h1 className="text-3xl sm:text-4xl font-light text-foreground">Seu carrinho está vazio</h1>
            <p className="text-lg text-foreground/60">Escolha algumas marmitas deliciosas para começar seu pedido</p>
            <Link
              href="/cardapio"
              className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
            >
              Voltar ao Cardápio
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden w-full">
      <Header />

      <section className="px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-4xl font-light text-foreground mb-12">Seu Carrinho</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <CartItems />
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
