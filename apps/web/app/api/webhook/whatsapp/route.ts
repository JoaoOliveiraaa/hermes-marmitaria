import { NextRequest, NextResponse } from "next/server"

/**
 * Webhook para enviar notificações via WhatsApp quando um pedido é criado
 * 
 * Integração com n8n:
 * 1. Configure uma workflow no n8n com um Webhook node
 * 2. Copie a URL do webhook do n8n
 * 3. Adicione a variável N8N_WEBHOOK_URL no arquivo .env.local
 * 4. O webhook será chamado automaticamente quando um pedido for criado
 * 
 * Recebe:
 * - pedido_id: ID do pedido
 * - cliente_telefone: Telefone do cliente (formato: 5511999999999)
 * - cliente_nome: Nome do cliente
 * - total: Valor total do pedido
 * - itens: Array de itens do pedido
 * - tipo_entrega: "entrega" ou "retirada"
 * - forma_pagamento: Forma de pagamento escolhida
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pedido_id, cliente_telefone, cliente_nome, total, itens, tipo_entrega, forma_pagamento } = body

    // Validação dos campos obrigatórios
    if (!pedido_id || !cliente_telefone || !cliente_nome) {
      return NextResponse.json(
        { error: "Campos obrigatórios: pedido_id, cliente_telefone, cliente_nome" },
        { status: 400 }
      )
    }

    // Limpar telefone (remover caracteres não numéricos)
    const telefoneLimpo = cliente_telefone.replace(/\D/g, "")

    // Garantir que o telefone tenha o código do país (55 para Brasil)
    const telefoneFormatado = telefoneLimpo.startsWith("55") ? telefoneLimpo : `55${telefoneLimpo}`

    // Formatar lista de itens
    const listaItens = itens
      .map((item: any) => {
        const tamanho = item.tamanho ? ` (${item.tamanho})` : ""
        const adicionais = item.adicionais?.length > 0 ? ` + ${item.adicionais.map((a: any) => a.nome).join(", ")}` : ""
        return `• ${item.quantidade}x ${item.nome}${tamanho}${adicionais} - R$ ${(item.preco * item.quantidade).toFixed(2)}`
      })
      .join("\n")

    // Montar mensagem
    const mensagem = `🍽️ *Pedido Confirmado - Hermes Marmitaria*

Olá, ${cliente_nome}! Seu pedido foi confirmado! 🎉

*Detalhes do Pedido:*
📋 ID: ${pedido_id}
${listaItens}

${tipo_entrega === "entrega" ? "🚗 *Entrega*" : "🏪 *Retirada no balcão*"}
💳 *Pagamento:* ${forma_pagamento}
💰 *Total:* R$ ${total.toFixed(2)}

Acompanharemos seu pedido e entraremos em contato em breve!

Obrigado pela preferência! 😊`

    // URL do WhatsApp Web (fallback)
    const whatsappUrl = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`

    // Preparar dados para enviar ao n8n
    const n8nPayload = {
      pedido_id,
      cliente_nome,
      cliente_telefone: telefoneFormatado,
      mensagem,
      total: total.toFixed(2),
      tipo_entrega,
      forma_pagamento,
      itens: itens.map((item: any) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
        tamanho: item.tamanho || null,
        adicionais: item.adicionais || [],
      })),
      timestamp: new Date().toISOString(),
    }

    // Se N8N_WEBHOOK_URL estiver configurado, enviar para o n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    let n8nResponse = null
    let n8nError = null

    if (n8nWebhookUrl) {
      try {
        const n8nResponseData = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(n8nPayload),
        })

        if (n8nResponseData.ok) {
          n8nResponse = await n8nResponseData.json().catch(() => ({ success: true }))
        } else {
          n8nError = `n8n retornou status ${n8nResponseData.status}`
        }
      } catch (error) {
        n8nError = error instanceof Error ? error.message : "Erro desconhecido ao chamar n8n"
        console.error("[Webhook WhatsApp] Erro ao chamar n8n:", error)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processado com sucesso",
      data: {
        pedido_id,
        cliente_nome,
        cliente_telefone: telefoneFormatado,
        total: total.toFixed(2),
      },
      n8n: {
        enviado: !!n8nWebhookUrl,
        sucesso: !!n8nResponse,
        erro: n8nError || null,
        resposta: n8nResponse || null,
      },
      whatsapp_url: whatsappUrl, // Fallback caso n8n não esteja configurado
    })
  } catch (error) {
    console.error("[Webhook WhatsApp] Erro:", error)
    return NextResponse.json(
      { error: "Erro ao processar webhook", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}

