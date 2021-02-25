/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), ProfileModule, forwardRef(() => AuthModule)],
    providers: [UserService],
    controllers: [UserController],
    exports: [TypeOrmModule, UserService]
})
export class UserModule{}
