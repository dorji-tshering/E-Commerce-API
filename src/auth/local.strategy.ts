/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

// use to verify a user with given input and assign a jwt token for future route guarding
import { HttpException, Injectable} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./services/auth.service";
const Strategy = require('passport-local');

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(private readonly authService: AuthService){
        super({
            usernameField: 'userName',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string){
        const user = await this.authService.validateUser(username, password);
        if(!user){
            throw new HttpException('invalid credentials', 422);
        }
        return user;
    }
}