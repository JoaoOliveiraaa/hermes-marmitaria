"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2 } from "lucide-react"

const horariosIniciais = [
  { dia: "Segunda-feira", abertura: "10:00", fechamento: "19:00" },
  { dia: "Terça-feira", abertura: "10:00", fechamento: "19:00" },
  { dia: "Quarta-feira", abertura: "10:00", fechamento: "19:00" },
  { dia: "Quinta-feira", abertura: "10:00", fechamento: "19:00" },
  { dia: "Sexta-feira", abertura: "10:00", fechamento: "19:00" },
  { dia: "Sábado", abertura: "10:00", fechamento: "15:00" },
  { dia: "Domingo", abertura: "Fechado", fechamento: "" },
]

export function AdminHorarios() {
  const [horarios, setHorarios] = useState(horariosIniciais)
  const [editingDia, setEditingDia] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ abertura: "", fechamento: "" })

  const handleEdit = (dia: string, abertura: string, fechamento: string) => {
    setEditingDia(dia)
    setEditValues({ abertura, fechamento })
  }

  const handleSave = (dia: string) => {
    setHorarios(horarios.map((h) => (h.dia === dia ? { ...h, ...editValues } : h)))
    setEditingDia(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-light">Gerenciar Horários</h2>

      <Card className="border-secondary">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dia da Semana</TableHead>
              <TableHead>Abertura</TableHead>
              <TableHead>Fechamento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {horarios.map((horario) => (
              <TableRow key={horario.dia}>
                <TableCell className="font-medium">{horario.dia}</TableCell>
                <TableCell>
                  {editingDia === horario.dia ? (
                    <Input
                      type="time"
                      value={editValues.abertura}
                      onChange={(e) => setEditValues({ ...editValues, abertura: e.target.value })}
                      className="w-32"
                    />
                  ) : (
                    horario.abertura
                  )}
                </TableCell>
                <TableCell>
                  {editingDia === horario.dia ? (
                    <Input
                      type="time"
                      value={editValues.fechamento}
                      onChange={(e) => setEditValues({ ...editValues, fechamento: e.target.value })}
                      className="w-32"
                    />
                  ) : (
                    horario.fechamento
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  {editingDia === horario.dia ? (
                    <>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleSave(horario.dia)}
                      >
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingDia(null)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(horario.dia, horario.abertura, horario.fechamento)}
                    >
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
