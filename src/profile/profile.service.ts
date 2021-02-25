/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProfileDTO } from './profile.dto'
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>
    ){}

    createProfile(data: ProfileDTO){
        const profile = this.profileRepository.create(data);
        return profile;
    }

    async deleteProfile(id: number){
        const deletedUser = await this.profileRepository.delete(id);
        return deletedUser;
    } 

    async updateProfile(id: number, data: Partial<ProfileDTO>){
        await this.profileRepository.update(id, data);
    }
}