"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Credenciais hardcoded para demo (em produção usar API)
    const validEmail = "admin@hermesmarmitaria.com"
    const validPassword = "hermes2025"

    if (email === validEmail && password === validPassword) {
      // Armazenar token simples em localStorage
      localStorage.setItem("adminToken", "demo-token-2025")
      router.push("/admin/dashboard")
    } else {
      setError("Email ou senha incorretos")
    }

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-secondary p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-light text-foreground mb-2">Hermes Admin</h1>
          <p className="text-foreground/60">Área de administração</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              placeholder="admin@hermesmarmitaria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="pt-4 border-t border-secondary">
          <p className="text-xs text-foreground/50 text-center">Demo: admin@hermesmarmitaria.com / hermes2025</p>
        </div>
      </Card>
    </main>
  )
}
