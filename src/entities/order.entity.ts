/* eslint-disable prettier/prettier */
import {Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, Column} from 'typeorm';
import { Product } from './product.entity';
import { UserEntity } from './user.entity';

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => UserEntity, user => user.orders)
    @JoinColumn()
    user: UserEntity;   
    
    @OneToOne(() => Product)
    @JoinColumn()
    product: Product; 

    @Column()
    quantity: number;

    @Column()
    shippingAddress: string;
}
