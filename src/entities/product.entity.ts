/* eslint-disable prettier/prettier */
import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({type:'varchar', length: 100, nullable: false})
    productName: string;

    @Column({type: 'varchar', length: 100, nullable: false})
    description: string;

    @Column({type: 'int', nullable: false})
    inStock: number;

    @Column({type: 'int', nullable: false})
    pricePerItem: number;
}
