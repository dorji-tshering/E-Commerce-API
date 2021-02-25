/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";


/* eslint-disable prettier/prettier */

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}

    @Post('register')
    async create(@Body() data: UserDTO) {
        return await this.userService.createNewUser(data);            
    }

    @UseGuards(JwtAuthGuard)
    @Patch('account/update')
    async updateUser(@Request() req, @Body() data: Partial<UserDTO>){
        return this.userService.updateUser(req.user.userId, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('account/delete')
    async deleteAccount(@Request() req){
        return await this.userService.deleteUser(req.user.userId);
    }
}