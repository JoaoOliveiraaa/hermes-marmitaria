"use client"

import { Phone, MapPin, Clock, MessageCircle, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const whatsappNumber = "5519998312853"
  const telefoneFormatado = "(19) 99831-2853"
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <footer className="bg-foreground text-background mt-20 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Hermes Marmitaria</h4>
            <p className="text-sm text-background/80 leading-relaxed">
              Marmitas frescas feitas com carinho em Analândia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Links</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <a href="/cardapio" className="hover:text-background transition-colors">
                  Cardápio
                </a>
              </li>
              <li>
                <a href="#horarios" className="hover:text-background transition-colors">
                  Horários
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-background transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg flex items-center gap-2">
              <Clock size={18} /> Horário
            </h4>
            <p className="text-sm text-background/80">
              Seg - Sex: 10h às 19h
              <br />
              Sábado: 10h às 15h
              <br />
              Domingo: Fechado
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Contato</h4>
            <div className="space-y-3 text-sm text-background/80">
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                <span>{telefoneFormatado}</span>
              </Link>
              <a
                href={`tel:${whatsappNumber}`}
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <Phone size={16} className="group-hover:scale-110 transition-transform" />
                <span>{telefoneFormatado}</span>
              </a>
              <a
                href="mailto:contato@hermesmarmitaria.com"
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                <span>contato@hermesmarmitaria.com</span>
              </a>
              <p className="flex items-center gap-2">
                <MapPin size={16} /> Rua 3, 796 - Centro, Analândia - SP
              </p>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mb-12 rounded-lg overflow-hidden h-64 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3698.8547391237355!2d-47.3102!3d-22.1897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c9b2a2a2a2a2a1%3A0x0!2sRua%203%2C%20796%20-%20Centro%2C%20Anal%C3%A2ndia%20-%20SP%2013550-000!5e0!3m2!1spt-BR!2sbr!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, maxWidth: "100%" }}
            allowFullScreen
            loading="lazy"
            className="w-full"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-background/60">
              © 2025 Hermes Marmitaria. Todos os direitos reservados.
            </p>
            <p className="text-xs text-background/50">
              CNPJ: 42.751.455/0001-99
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
