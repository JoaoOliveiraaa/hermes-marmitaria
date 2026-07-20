"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Este dashboard separado não deve mais existir.
    // Mantemos a rota apenas para compatibilidade e redirecionamos para /admin.
    router.replace("/admin")
  }, [router])

  return null
}
