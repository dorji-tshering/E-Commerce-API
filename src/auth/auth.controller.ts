/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./services/auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @UseGuards(LocalAuthGuard)
    @Post('user/login')
    async userLogin(@Request() req) {
        return await this.authService.userLogin(req.user);
    }
}