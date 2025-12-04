"use client"

import { ShoppingCart, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/context/cart-context"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full overflow-hidden max-w-full">
      {/* Background com imagem e overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/95 to-background/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('/marmita-carne-vermelha-fresca.jpg')] bg-cover bg-center opacity-5"></div>
      </div>
      
      {/* Borda inferior mais visível */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary/80 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-secondary/50"></div>
      
      <div className="relative w-full max-w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center h-20 w-full max-w-full">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0 absolute left-4 sm:left-6 lg:left-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white border-2 border-secondary flex items-center justify-center flex-shrink-0">
              <Image
                src="/hermes-logo.png"
                alt="Hermes Marmitaria"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col gap-0 min-w-0">
              <span className="text-lg font-bold text-secondary truncate">Hermes</span>
              <span className="text-xs text-foreground/60 font-light truncate">Marmitaria</span>
            </div>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-6 mx-auto">
            <Link
              href="/cardapio"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Cardápio
            </Link>
            <Link
              href="#horarios"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Horários
            </Link>
            <Link
              href="#contato"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Contato
            </Link>
            <Link
              href="/acompanhar-pedido"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Acompanhar meu pedido
            </Link>
          </nav>

          {/* Cart - Right */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 absolute right-4 sm:right-6 lg:right-8">
            <Link href="/carrinho" className="relative p-2 hover:bg-primary/10 rounded-lg transition-colors">
              <ShoppingCart size={20} className="text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden py-4 border-t border-border space-y-2 overflow-x-hidden">
            <Link
              href="/cardapio"
              className="block px-4 py-2 text-sm font-medium hover:bg-primary/10 rounded-lg transition-colors"
            >
              Cardápio
            </Link>
            <Link
              href="#horarios"
              className="block px-4 py-2 text-sm font-medium hover:bg-primary/10 rounded-lg transition-colors"
            >
              Horários
            </Link>
            <Link
              href="#contato"
              className="block px-4 py-2 text-sm font-medium hover:bg-primary/10 rounded-lg transition-colors"
            >
              Contato
            </Link>
            <Link
              href="/acompanhar-pedido"
              className="block px-4 py-2 text-sm font-medium hover:bg-primary/10 rounded-lg transition-colors"
            >
              Acompanhar meu pedido
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
