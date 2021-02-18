/* eslint-disable prettier/prettier */
import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity("profile")
export class Profile {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({type:'varchar', length: 100, nullable: false})
    firstName: string;

    @Column({type: 'varchar', length: 100, nullable: false})
    lastName: string;

    @Column({type: 'varchar', length: 100, nullable: false})
    city: string;

    @Column({type: 'varchar', length: 100, nullable: false})
    dzongkhag: string;

    @Column({type: 'varchar', length: 100, nullable: false})
    phone: string;
}
