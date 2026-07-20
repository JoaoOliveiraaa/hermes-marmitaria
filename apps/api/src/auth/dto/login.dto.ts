import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@hermesmarmitaria.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "hermes2025", minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
