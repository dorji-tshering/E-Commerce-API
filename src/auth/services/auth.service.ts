/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint @typescript-eslint/no-var-requires: "off" */

const bcrypt = require('bcrypt');
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
                @Inject(forwardRef(() => UserService))
                private readonly userService: UserService){}

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    //bcrypt.compare(unhashed password, hashed password)
    async comparePasswords(newPassword: string, passwordHash: string): Promise<boolean>{
        return await bcrypt.compare(newPassword, passwordHash);
    }

    async validateUser(username: string, pass: string){
        const user = await this.userService.findOneByUsername(username);
        const match = await this.comparePasswords(pass, user.password);
        if(match){
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async userLogin(user: any){
        const payload = {username: user.userName, sub: user.Id};
        return {access_token: this.jwtService.sign(payload)};
    }
}
