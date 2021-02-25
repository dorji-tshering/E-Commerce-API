/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {HttpException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { Profile } from 'src/entities/profile.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ProductDTO } from 'src/products/product.dto';
import { ProductService } from 'src/products/product.service';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>, 
        private readonly productService: ProductService
    ){}

    async createOrder(userId: number, productId: number, quantity: number){
        const user = await this.userRepository.findOne({ relations: ['profile'], where: {Id: userId}});
        const {password, confirmPassword, ...result} = user;

        const product = await this.productRepository.findOne({  where: {Id: productId}});
        if(product === undefined){
            throw new HttpException('No product with the given Id!', 422);
        }

        const inStock = product.inStock;
        if(quantity > inStock){
            throw new HttpException('Quantity exceeded the stock!', 422);
        }

        const userProfile = await this.profileRepository.findOne({ where: { Id: user.profile.Id}}); 
        const shippingAddress = userProfile.city + ', ' + userProfile.dzongkhag;

        // generated orderData from the given infos
        const orderData = {
            quantity: quantity,
            shippingAddress: shippingAddress,
            user: result,
            product: product
        }
        const newOrder =  this.orderRepository.create(orderData);
        await this.orderRepository.save(newOrder);

        const stocksLeft = inStock - quantity;
        const productData = {
            inStock: stocksLeft
        }
        this.productService.updateProduct(productId, productData);
        return newOrder;
    }
    
    async getOrders(userId: number){
        const user = await this.userRepository.findOne({relations: ['orders', 'orders.product'], where: {Id: userId}});
        return user.orders;
    }

    async cancelOrder(orderId: number, userId: number){
        const order = await this.orderRepository.findOne({relations: ['user'], where: {Id: orderId}});
        if(order === undefined){
            throw new HttpException('There is no order with the given Id', 422);
        }
        if(order.user.Id === userId){
            return await this.orderRepository.delete(orderId);
        }
        throw new HttpException('The order isn\'t yours to cancel', 422);
    }
}