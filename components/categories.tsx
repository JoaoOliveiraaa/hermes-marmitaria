"use client"

import Link from "next/link"
import { UtensilsCrossed, Droplets, Cake, Plus, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

const categories = [
  {
    icon: UtensilsCrossed,
    title: "Pratos do Dia",
    description: "Seleção diária de marmitas frescas",
    href: "/cardapio",
    gradient: "from-primary/20 to-secondary/20",
    iconBg: "bg-gradient-to-br from-primary to-secondary",
  },
  {
    icon: Droplets,
    title: "Bebidas",
    description: "Sucos, refrigerantes e água",
    href: "/cardapio#bebidas",
    gradient: "from-primary/20 to-secondary/20",
    iconBg: "bg-gradient-to-br from-primary to-secondary",
  },
  {
    icon: Cake,
    title: "Doces",
    description: "Deliciosas sobremesas",
    href: "/cardapio#doces",
    gradient: "from-primary/20 to-secondary/20",
    iconBg: "bg-gradient-to-br from-primary to-secondary",
  },
  {
    icon: Plus,
    title: "Adicionais",
    description: "Complementos para sua marmita",
    href: "/cardapio#adicionais",
    gradient: "from-primary/20 to-secondary/20",
    iconBg: "bg-gradient-to-br from-primary to-secondary",
  },
]

export function Categories() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-2">Navegue por categorias</h2>
          <p className="text-foreground/60">Escolha o que você procura</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.title} href={category.href} className="group block h-full">
                <Card className="relative h-full p-6 border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden group-hover:-translate-y-1">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className={`relative p-4 rounded-2xl ${category.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className="text-white" />
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-foreground/60 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <span className="text-sm font-medium">Ver mais</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
