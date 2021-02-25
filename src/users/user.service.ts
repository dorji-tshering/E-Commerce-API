/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint @typescript-eslint/no-var-requires: "off" */


import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth/services/auth.service";
import { Profile } from "src/entities/profile.entity";
import { UserEntity } from "src/entities/user.entity";
import { ProfileService } from "src/profile/profile.service";
import { Repository } from "typeorm";
import { User } from "./user";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        private readonly profileService: ProfileService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ){}

    // get user
   /* async getUser(){
        return await this.userRepository.find();
    }*/

    // creates a new user if it does not exist already
    async createNewUser(data: UserDTO){
        const { firstName, lastName, city, dzongkhag, phone, userName, email} = data;       
        const profileData = {
            firstName: firstName,
            lastName: lastName,
            city: city,
            dzongkhag: dzongkhag,
            phone: phone
        }       

        // userName validation
        let user = await this.userRepository.find({ where: {userName}});  
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
        if(data.password !== data.confirmPassword){
            throw new HttpException('confirmPassword does not match password!', 422);
        }

        // creates a profile first before User to fetch the profileId
        const newProfile = this.profileService.createProfile(profileData);        
        this.profileRepository.save(newProfile);
        
        // creates a new User and links it with the profile through fk-profileId
        const hashedPassword = await this.authService.hashPassword(data.password);
        const userData = {
            userName: userName,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            email: email,
            profile: newProfile
        }

        const newUser =  this.userRepository.create(userData);
        await this.userRepository.save(newUser);

        const { password, confirmPassword, ... result} = newUser;
        return result;
    }

    async findOneByUsername(userName: string){
        const user = await this.userRepository.findOne({where: {userName}, relations: ['profile']});
        if(!user){
            throw new HttpException('Invalid username or password', 422);
        }
        const {confirmPassword, ...result} = user;
        return result;
    }

    async findOneById(id: number){
        const user = await this.userRepository.findOne(id, {relations: ['profile']});
        const {password, confirmPassword, ...result} = user;
        return result;
    }

    async finaAll() {
        const users: UserEntity[] = await this.userRepository.find({relations: ['profile']});
        users.map(function(user) {delete user.password; delete user.confirmPassword});
        return users;
    }  


    async deleteUser(id: number){
        const user = await this.userRepository.findOne({relations: ['profile'], where: {Id: id}});
        // deletes the existing user
        const deletedUser = await this.userRepository.delete(id);
        const deletedProfile = await this.profileService.deleteProfile(user.profile.Id);
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
      
        const user = await this.userRepository.findOne({relations: ['profile'], 
                                                             where: {Id: id}});
        const profileId = user.profile.Id;

        // updating userName validation 
        if(data.userName){
            const user = await this.userRepository.findOne({ where: {userName: data.userName}});  
            if(user !== undefined){
                if(data.userName === user.userName){
                    throw new HttpException('User already exist!', 422);
                }
            }
            else{userData.userName = data.userName;}
        }

        // updating email confirmation
        if(data.email){
            const user = await this.userRepository.findOne({ where: {email: data.email}});
            if(user !== undefined){
                if(data.email === user.email){
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

        // updates the profile with the given data if any
        if(Object.keys(profileData).length !== 0){
            await this.profileService.updateProfile(profileId, profileData);
        }

        // updates the user with the given data if any
        if(Object.keys(userData).length !== 0){
            await this.userRepository.update(id, userData);
        }
        const {password, confirmPassword, ...result} = user;
        return result;
    }
}