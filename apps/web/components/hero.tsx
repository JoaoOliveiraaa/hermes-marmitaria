"use client"

import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Banner Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
        <Image
          src="/marmita-carne-vermelha-fresca.jpg"
          alt="Marmitas frescas"
          fill
          className="object-cover opacity-10"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-32 sm:py-40 lg:py-48">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-sm font-medium text-primary">✨ Feito com carinho em Analândia</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground leading-tight">
              Sua marmita
              <br />
              <span className="text-primary font-normal">fresca do dia</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-foreground/80 max-w-2xl mx-auto">
              Ingredientes selecionados, preparados com amor para sua saúde e bem-estar
            </p>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Cada refeição é uma experiência única de sabor e qualidade. 
            Marmitas nutritivas e deliciosas, prontas para você saborear.
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 px-10 py-5 bg-primary hover:bg-primary/90 text-foreground rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-1"
            >
              Ver Cardápio Completo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    </section>
  )
}
