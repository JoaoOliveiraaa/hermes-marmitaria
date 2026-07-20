/**
 * Faz upload de imagem usando a API route do Next.js
 * A API route usa Supabase Storage para armazenar as imagens
 */
export async function uploadImageToBlob(file: File): Promise<string> {
  try {
    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      throw new Error("Apenas imagens são permitidas")
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error("Arquivo muito grande. Máximo: 5MB")
    }

    // Criar FormData para enviar o arquivo
    const formData = new FormData()
    formData.append("file", file)

    // Fazer upload via API route
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }))
      throw new Error(errorData.error || errorData.message || "Erro ao fazer upload")
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("[Upload] Erro ao fazer upload da imagem:", error)
    
    // Se o erro for sobre bucket não configurado, retornar placeholder
    if (error instanceof Error && error.message.includes("Bucket")) {
      console.warn('[Upload] Bucket não configurado. Usando placeholder. Veja docs/SUPABASE_STORAGE_SETUP.md')
      return `/placeholder.jpg`
    }
    
    throw error
  }
}
