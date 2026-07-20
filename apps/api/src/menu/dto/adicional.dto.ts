import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateAdicionalDto {
  @ApiProperty({ example: "Ovo frito" })
  @IsString()
  @MinLength(1)
  nome!: string;

  @ApiProperty({ example: 3 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco!: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class UpdateAdicionalDto extends PartialType(CreateAdicionalDto) {}
