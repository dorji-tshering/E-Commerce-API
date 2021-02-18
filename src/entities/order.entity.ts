/* eslint-disable prettier/prettier */
import {Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, Column} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => User)
    user: User;   // customer: relation id
    
    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;  // product: relation id

    @Column()
    quantity: number;

    @Column()
    shippingAddress: string;
}
