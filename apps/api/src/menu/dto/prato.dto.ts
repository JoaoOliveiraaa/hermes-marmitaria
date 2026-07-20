import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Categoria, DiaSemana } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export class TamanhoDto {
  @ApiProperty({ example: "M" })
  @IsString()
  @MinLength(1)
  nome!: string;

  @ApiProperty({ example: 18.9 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco!: number;
}

export class CreatePratoDto {
  @ApiProperty({ example: "Feijoada" })
  @IsString()
  @MinLength(1)
  nome!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @ApiProperty({ enum: Categoria, default: Categoria.PRATO })
  @IsEnum(Categoria)
  categoria!: Categoria;

  @ApiProperty({ example: 22.5, description: "Preço base em reais" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precoBase!: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({ type: [TamanhoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TamanhoDto)
  tamanhos?: TamanhoDto[];

  @ApiPropertyOptional({ enum: DiaSemana, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(DiaSemana, { each: true })
  dias?: DiaSemana[];
}

export class UpdatePratoDto extends PartialType(CreatePratoDto) {}
