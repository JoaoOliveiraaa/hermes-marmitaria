import {
  applyDecorators,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateAdicionalDto, UpdateAdicionalDto } from "./dto/adicional.dto";
import { CreatePratoDto, UpdatePratoDto } from "./dto/prato.dto";
import { MenuService } from "./menu.service";

const StaffOnly = () =>
  applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(Role.OWNER, Role.STAFF), ApiBearerAuth());

@ApiTags("menu")
@Controller("menu")
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  // ── Pratos ──────────────────────────────────────────────────────────
  @Get("pratos")
  @ApiOperation({ summary: "Lista pratos ativos (público)" })
  listPratos() {
    return this.menu.listPratos();
  }

  @Get("pratos/:id")
  @ApiOperation({ summary: "Detalha um prato (público)" })
  getPrato(@Param("id", ParseUUIDPipe) id: string) {
    return this.menu.getPrato(id);
  }

  @Post("pratos")
  @StaffOnly()
  @ApiOperation({ summary: "Cria prato (protegido)" })
  createPrato(@Body() dto: CreatePratoDto) {
    return this.menu.createPrato(dto);
  }

  @Patch("pratos/:id")
  @StaffOnly()
  @ApiOperation({ summary: "Atualiza prato (protegido)" })
  updatePrato(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdatePratoDto) {
    return this.menu.updatePrato(id, dto);
  }

  @Delete("pratos/:id")
  @StaffOnly()
  @ApiOperation({ summary: "Remove prato (protegido)" })
  deletePrato(@Param("id", ParseUUIDPipe) id: string) {
    return this.menu.deletePrato(id);
  }

  // ── Adicionais ──────────────────────────────────────────────────────
  @Get("adicionais")
  @ApiOperation({ summary: "Lista adicionais ativos (público)" })
  listAdicionais() {
    return this.menu.listAdicionais();
  }

  @Post("adicionais")
  @StaffOnly()
  @ApiOperation({ summary: "Cria adicional (protegido)" })
  createAdicional(@Body() dto: CreateAdicionalDto) {
    return this.menu.createAdicional(dto);
  }

  @Patch("adicionais/:id")
  @StaffOnly()
  @ApiOperation({ summary: "Atualiza adicional (protegido)" })
  updateAdicional(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateAdicionalDto) {
    return this.menu.updateAdicional(id, dto);
  }

  @Delete("adicionais/:id")
  @StaffOnly()
  @ApiOperation({ summary: "Remove adicional (protegido)" })
  deleteAdicional(@Param("id", ParseUUIDPipe) id: string) {
    return this.menu.deleteAdicional(id);
  }
}
