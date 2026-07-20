"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2 } from "lucide-react"

const fretesIniciais = [
  { id: "1", descricao: "Retirada no balcão", valor: 0 },
  { id: "2", descricao: "Entrega em Analândia", valor: 5.0 },
]

export function AdminFrete() {
  const [fretes, setFretes] = useState(fretesIniciais)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValor, setEditingValor] = useState("")

  const handleEdit = (id: string, valor: number) => {
    setEditingId(id)
    setEditingValor(valor.toString())
  }

  const handleSave = (id: string) => {
    setFretes(fretes.map((f) => (f.id === id ? { ...f, valor: Number.parseFloat(editingValor) } : f)))
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-light">Gerenciar Fretes</h2>

      <Card className="border-secondary">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fretes.map((frete) => (
              <TableRow key={frete.id}>
                <TableCell className="font-medium">{frete.descricao}</TableCell>
                <TableCell>
                  {editingId === frete.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editingValor}
                      onChange={(e) => setEditingValor(e.target.value)}
                      className="w-24"
                    />
                  ) : (
                    `R$ ${frete.valor.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  {editingId === frete.id ? (
                    <>
                      <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleSave(frete.id)}>
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(frete.id, frete.valor)}>
                      <Edit2 size={14} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
