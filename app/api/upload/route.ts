import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Apenas imagens são permitidas" }, { status: 400 })
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Arquivo muito grande. Máximo: 5MB" }, { status: 400 })
    }

    const supabase = await createClient()

    // Gerar nome único para o arquivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `pratos/${fileName}`

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Fazer upload do arquivo
    const { data, error } = await supabase.storage.from("publico").upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("[Upload API] Erro:", error)
      
      // Se o bucket não existir, retornar erro informativo
      if (error.message.includes("Bucket not found") || error.message.includes("The resource was not found")) {
        return NextResponse.json(
          {
            error: "Bucket de storage não configurado",
            message: "Configure o Supabase Storage primeiro. Veja docs/SUPABASE_STORAGE_SETUP.md",
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obter URL pública da imagem
    const {
      data: { publicUrl },
    } = supabase.storage.from("publico").getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("[Upload API] Erro:", error)
    return NextResponse.json(
      { error: "Erro ao fazer upload", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}

