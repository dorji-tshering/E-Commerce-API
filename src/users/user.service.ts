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
        let user = await this.userRepository.findOne({ where: {userName}});  
        if(user !== undefined){
            if(userName === user.userName){
                throw new HttpException('User already exist!', 422);
            }
        }
        // email validation
        user = await this.userRepository.findOne({ where: {email}});
        if(user !== undefined){
            if(email === user.email){
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

    // finds user entity by username
    async findOneByUsername(userName: string){
        const user = await this.userRepository.findOne({where: {userName}, relations: ['profile']});
        if(!user){
            throw new HttpException('Invalid username or password', 422);
        }
        const {confirmPassword, ...result} = user;
        return result;
    }
    // finds user entity by id
    async findOneById(id: number){
        const user = await this.userRepository.findOne(id, {relations: ['profile']});
        const {password, confirmPassword, ...result} = user;
        return result;
    }
    // get all users
    async finaAll() {
        const users: UserEntity[] = await this.userRepository.find({relations: ['profile']});
        users.map(function(user) {delete user.password; delete user.confirmPassword});
        return users;
    }  

    // deletes the user account
    async deleteUser(id: number){
        const user = await this.userRepository.findOne({relations: ['profile'], where: {Id: id}});
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

        // should not return password and confirm password
        const {password, confirmPassword, ...result} = user;
        return result;
    }
}