/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [TypeOrmModule.forFeature([Profile])],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [TypeOrmModule, ProfileService]
})
export class ProfileModule{}