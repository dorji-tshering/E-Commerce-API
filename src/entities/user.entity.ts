/* eslint-disable prettier/prettier */
import { PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Entity } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    userName: string;

    @Column()
    password: string;

    @Column()
    confirmPassword: string;

    @Column()
    email: string;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;
}