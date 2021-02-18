/* eslint-disable prettier/prettier */

import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "src/entities/profile.entity";
import { User } from "src/entities/user.entity";
import { ProfileService } from "src/profile/profile.service";
import { Repository } from "typeorm";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        private readonly profileService: ProfileService
    ){}

    // creates a new user if it does not exist already
    async createNewUser(data: UserDTO){
        const { firstName, lastName, city, dzongkhag, phone, userName, password, 
                confirmPassword, email} = data;       
        const profileData = {
            firstName: firstName,
            lastName: lastName,
            city: city,
            dzongkhag: dzongkhag,
            phone: phone
        }

        // finds the first instance of entity by given options => [entity instances]
        // userName validation
        let user: User[] = await this.userRepository.find({ where: {userName}});  
        if(user[0] !== undefined){
            if(userName === user[0].userName){
                throw new HttpException('User already exist!', 422);
            }
        }
        // email validation
        user = await this.userRepository.find({ where: {email}});
        if(user[0] !== undefined){
            if(email === user[0].email){
                throw new HttpException('Email already exists', 422);
            }
        }
        //password confirmation
        if(password !== confirmPassword){
            throw new HttpException('confirmPassword does not match password!', 422);
        }

        // creates a profile first before User to fetch the profileId
        const newProfile = await this.profileService.createProfile(profileData);
        await this.profileRepository.save(newProfile);
        const userData = {
            userName: userName,
            password: password,
            confirmPassword: confirmPassword,
            email: email,
            profile: newProfile
        }
        // creates a new User and links it with the profile through fk-profileId
        const newUser: User = this.userRepository.create(userData);
        return await this.userRepository.save(newUser);
    }

    async deleteUser(id: number){
        // checks if the userId is valid
        const user: User[] = await this.userRepository.find({ where: {Id: id}});
        if(user[0] === undefined){
            throw new HttpException('No user with given ID!', 422);
        }
        // deletes the existing user
        const deletedUser = await this.userRepository.delete(id);
        const deletedProfile = await this.profileService.deleteProfile(id);
        return [deletedUser, deletedProfile]
    }

    // updates the user properties with the given data
    async updateUser(id: number, data: Partial<UserDTO>){

        // Ensures type-safety of the userData properties
        interface UserDataType {
            userName: string;
            password: string;
            confirmPassword: string;
            email: string;
        }

        const userData: Partial<UserDataType> = {};
      
        // user validation with the given ID
        const user: User[] = await this.userRepository.find({relations: ['profile'], 
                                            where: {Id: id}});
        const profileId = user[0].profile.Id;
        if(user[0] === undefined){
            throw new HttpException('No user with the given ID', 422);
        }

        // updating userName validation 
        if(data.userName){
            const user: User[] = await this.userRepository.find({ where: {userName: data.userName}});  
            if(user[0] !== undefined){
                if(data.userName === user[0].userName){
                    throw new HttpException('User already exist!', 422);
                }
            }
            else{userData.userName = data.userName;}
        }

        // updating email confirmation
        if(data.email){
            const user: User[] = await this.userRepository.find({ where: {email: data.email}});
            if(user[0] !== undefined){
                if(data.email === user[0].email){
                    throw new HttpException('Email already exists', 422);
                }
            }
            else{userData.email = data.email;}
        }

        // updating password confirmation
        if(data.password){
            if(data.password !== data.confirmPassword){
                throw new HttpException('ConfirmPassword does not match password!', 422);
            }
            else{
                userData.password = data.password;
                userData.confirmPassword = data.confirmPassword;
            }
        }
          
        // Ensures type-safety of the profileData proterties
        interface ProfileDataType {
            firstName: string;
            lastName: string;
            city: string;
            dzongkhag: string;
            phone: string;
        }

        // generate profileData if any
        const profileData: Partial<ProfileDataType> = {};
        if(data.firstName){
            profileData.firstName = data.firstName;
        }
        if(data.lastName){
            profileData.lastName = data.lastName;
        }
        if(data.city){
            profileData.city = data.city;
        }
        if(data.dzongkhag){
            profileData.dzongkhag = data.dzongkhag;
        }
        if(data.phone){
            profileData.phone = data.phone;
        }
        console.log(profileData);

        if(Object.keys(profileData).length !== 0){
            this.profileService.updateProfile(profileId, profileData);
        }

        // updates the user with the given ID
        return await this.userRepository.update(id, userData);
    }
}