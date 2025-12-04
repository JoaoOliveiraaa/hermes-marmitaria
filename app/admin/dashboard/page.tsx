"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { AdminPratos } from "@/components/admin/admin-pratos"
import { AdminFrete } from "@/components/admin/admin-frete"
import { AdminHorarios } from "@/components/admin/admin-horarios"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthed(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  if (!isAuthed) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light">Painel Administrativo</h1>
            <p className="text-background/70 text-sm">Gerenciar Hermes Marmitaria</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="bg-background text-foreground hover:bg-secondary">
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="pratos" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="pratos">Pratos</TabsTrigger>
            <TabsTrigger value="frete">Frete</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
          </TabsList>

          <TabsContent value="pratos" className="space-y-6 mt-6">
            <AdminPratos />
          </TabsContent>

          <TabsContent value="frete" className="space-y-6 mt-6">
            <AdminFrete />
          </TabsContent>

          <TabsContent value="horarios" className="space-y-6 mt-6">
            <AdminHorarios />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
