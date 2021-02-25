/* eslint-disable prettier/prettier */
import { PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Entity, BeforeInsert, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Profile } from './profile.entity';

@Entity('users')
export class UserEntity {
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

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @BeforeInsert()
    emailToLowerCase(){
        this.email.toLowerCase();
    }
}