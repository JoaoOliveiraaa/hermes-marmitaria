import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Hermes Marmitaria | Marmitas Frescas em Analândia",
  description: "Sua marmita fresca do dia, feita com carinho. Pedidos de marmitas em Analândia, SP.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/hermes-logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/hermes-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/hermes-logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/hermes-logo.png.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="overflow-x-hidden">
      <body className={`${_geist.className} font-sans antialiased overflow-x-hidden w-full`}>
        <CartProvider>{children}</CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
