"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Este login separado não deve mais ser usado.
    // Redireciona sempre para o painel único em /admin.
    router.replace("/admin")
  }, [router])

  return null
}
