"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2 } from "lucide-react"

const pratosIniciais = [
  {
    id: "1",
    nome: "Marmita Premium",
    descricao: "Frango grelhado com arroz integral",
    preco: 18.9,
  },
  {
    id: "2",
    nome: "Marmita Vegetariana",
    descricao: "Legumes variados com quinoa",
    preco: 16.9,
  },
]

export function AdminPratos() {
  const [pratos, setPratos] = useState(pratosIniciais)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ nome: "", descricao: "", preco: "" })

  const handleAdd = () => {
    if (!formData.nome || !formData.preco) return

    if (editingId) {
      setPratos(
        pratos.map((p) =>
          p.id === editingId
            ? { ...p, nome: formData.nome, descricao: formData.descricao, preco: Number.parseFloat(formData.preco) }
            : p,
        ),
      )
      setEditingId(null)
    } else {
      setPratos([
        ...pratos,
        {
          id: Date.now().toString(),
          nome: formData.nome,
          descricao: formData.descricao,
          preco: Number.parseFloat(formData.preco),
        },
      ])
    }

    setFormData({ nome: "", descricao: "", preco: "" })
    setIsOpen(false)
  }

  const handleEdit = (prato: (typeof pratos)[0]) => {
    setEditingId(prato.id)
    setFormData({ nome: prato.nome, descricao: prato.descricao, preco: prato.preco.toString() })
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setPratos(pratos.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light">Gerenciar Pratos</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingId(null)
                setFormData({ nome: "", descricao: "", preco: "" })
              }}
            >
              <Plus size={16} className="mr-2" />
              Novo Prato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Prato" : "Novo Prato"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do prato"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do prato"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90">
                {editingId ? "Atualizar" : "Criar"} Prato
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-secondary">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pratos.map((prato) => (
              <TableRow key={prato.id}>
                <TableCell className="font-medium">{prato.nome}</TableCell>
                <TableCell className="text-sm text-foreground/60">{prato.descricao}</TableCell>
                <TableCell>R$ {prato.preco.toFixed(2)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(prato)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 bg-transparent"
                    onClick={() => handleDelete(prato.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
