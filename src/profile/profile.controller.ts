/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('customers')
export class ProfileController {
    constructor(private profileService: ProfileService){}  

}