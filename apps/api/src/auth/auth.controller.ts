import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { isProd } from "../config/env";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthUser } from "./types/jwt-payload";

const REFRESH_COOKIE = "hermes_refresh";
const REFRESH_PATH = "/api/auth";
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: REFRESH_PATH,
      maxAge: REFRESH_MAX_AGE_MS,
    });
  }

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Login do admin (retorna access token; refresh via cookie httpOnly)" })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...rest } = await this.auth.login(dto.email, dto.password);
    this.setRefreshCookie(res, refreshToken);
    return rest;
  }

  @Post("refresh")
  @HttpCode(200)
  @ApiOperation({ summary: "Renova o access token usando o refresh cookie" })
  async refresh(
    @Req() req: Request & { cookies?: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.auth.refresh(req.cookies?.[REFRESH_COOKIE]);
    this.setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  @Post("logout")
  @HttpCode(200)
  @ApiOperation({ summary: "Logout (limpa o refresh cookie)" })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_COOKIE, { path: REFRESH_PATH });
    return { ok: true };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Dados do usuário autenticado" })
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
