import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

import { env } from "../config/env";
import { UsersService } from "../users/users.service";
import { JwtPayload } from "./types/jwt-payload";

interface TokenSubject {
  id: string;
  email: string;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  private async issueTokens(subject: TokenSubject) {
    const payload: JwtPayload = { sub: subject.id, email: subject.email, role: subject.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.JWT_ACCESS_TTL as JwtSignOptions["expiresIn"],
      }),
      this.jwt.signAsync(payload, {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_TTL as JwtSignOptions["expiresIn"],
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    // Compara sempre (mesmo sem usuário) para não vazar existência por timing.
    const senhaHash = user?.senhaHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinv";
    const ok = await bcrypt.compare(password, senhaHash);
    if (!user || !ok) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const tokens = await this.issueTokens(user);
    return {
      ...tokens,
      user: { id: user.id, email: user.email, nome: user.nome, role: user.role },
    };
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token ausente");
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Refresh token inválido ou expirado");
    }

    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado");
    }

    return this.issueTokens(user);
  }
}
