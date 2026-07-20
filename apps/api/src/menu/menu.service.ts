import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateAdicionalDto, UpdateAdicionalDto } from "./dto/adicional.dto";
import { CreatePratoDto, UpdatePratoDto } from "./dto/prato.dto";

const pratoInclude = {
  tamanhos: true,
  diasDisponiveis: { where: { ativo: true }, select: { diaSemana: true } },
} as const;

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Pratos ──────────────────────────────────────────────────────────
  listPratos(apenasAtivos = true) {
    return this.prisma.prato.findMany({
      where: apenasAtivos ? { ativo: true } : undefined,
      include: pratoInclude,
      orderBy: { nome: "asc" },
    });
  }

  async getPrato(id: string) {
    const prato = await this.prisma.prato.findUnique({ where: { id }, include: pratoInclude });
    if (!prato) throw new NotFoundException("Prato não encontrado");
    return prato;
  }

  createPrato(dto: CreatePratoDto) {
    const { tamanhos, dias, ...data } = dto;
    return this.prisma.prato.create({
      data: {
        ...data,
        tamanhos: tamanhos?.length ? { create: tamanhos } : undefined,
        diasDisponiveis: dias?.length ? { create: dias.map((diaSemana) => ({ diaSemana })) } : undefined,
      },
      include: pratoInclude,
    });
  }

  async updatePrato(id: string, dto: UpdatePratoDto) {
    await this.getPrato(id); // 404 se não existir
    const { tamanhos, dias, ...data } = dto;

    return this.prisma.$transaction(async (tx) => {
      // Substitui coleções por completo quando enviadas (replace, não merge).
      if (tamanhos) {
        await tx.tamanho.deleteMany({ where: { pratoId: id } });
        if (tamanhos.length) {
          await tx.tamanho.createMany({ data: tamanhos.map((t) => ({ ...t, pratoId: id })) });
        }
      }
      if (dias) {
        await tx.pratoDia.deleteMany({ where: { pratoId: id } });
        if (dias.length) {
          await tx.pratoDia.createMany({ data: dias.map((diaSemana) => ({ pratoId: id, diaSemana })) });
        }
      }
      return tx.prato.update({ where: { id }, data, include: pratoInclude });
    });
  }

  async deletePrato(id: string) {
    await this.getPrato(id);
    await this.prisma.prato.delete({ where: { id } });
    return { ok: true };
  }

  // ── Adicionais ──────────────────────────────────────────────────────
  listAdicionais(apenasAtivos = true) {
    return this.prisma.adicional.findMany({
      where: apenasAtivos ? { ativo: true } : undefined,
      orderBy: { nome: "asc" },
    });
  }

  createAdicional(dto: CreateAdicionalDto) {
    return this.prisma.adicional.create({ data: dto });
  }

  async updateAdicional(id: string, dto: UpdateAdicionalDto) {
    const existe = await this.prisma.adicional.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException("Adicional não encontrado");
    return this.prisma.adicional.update({ where: { id }, data: dto });
  }

  async deleteAdicional(id: string) {
    const existe = await this.prisma.adicional.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException("Adicional não encontrado");
    await this.prisma.adicional.delete({ where: { id } });
    return { ok: true };
  }
}
