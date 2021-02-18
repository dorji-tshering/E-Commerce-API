/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ProfileModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [TypeOrmModule]
})
export class UserModule{}
