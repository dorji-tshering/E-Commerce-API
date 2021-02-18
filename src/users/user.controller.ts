/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";

/* eslint-disable prettier/prettier */

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post('create')
    create(@Body() data: UserDTO){
        return this.userService.createNewUser(data);
    }

    @Delete('delete/:id')
    deleteUser(@Param('id') id: number){
        return this.userService.deleteUser(id);
    }

    @Patch('update/:id')
    update(@Param('id') id: number, @Body() data: Partial<UserDTO>){
        return this.userService.updateUser(id, data);
    }
}