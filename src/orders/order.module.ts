/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { Profile } from 'src/entities/profile.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ProductModule } from 'src/products/product.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Product, UserEntity, Profile]), ProductModule],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [TypeOrmModule]
})
export class OrderModule{}