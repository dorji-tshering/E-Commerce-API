/* eslint-disable prettier/prettier */
import {HttpException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { ProductDTO } from 'src/products/product.dto';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>  
    ){}

    async createOrder(userId: number, productId: number, quantity: number){
        const user = await this.userRepository.find({ relations: ['profile'], where: {Id: userId}});

        // confirm if the user and the product exist
        if(user[0] === undefined){
            throw new HttpException('No user with given Id!', 422);
        }
        const product = await this.productRepository.find({  where: {Id: productId}}, );
        if(product[0] === undefined){
            throw new HttpException('No product with the given Id!', 422);
        }

        const inStock = product[0].inStock;
        if(quantity > inStock){
            throw new HttpException('Quantity exceeded the stock!', 422);
        }

        const userProfile = await this.profileRepository.find({ where: { Id: user[0].profile.Id}}); 
        const shippingAddress = userProfile[0].city + ', ' + userProfile[0].dzongkhag;

        // generated orderData from the given infos
        const orderData = {
            quantity: quantity,
            shippingAddress: shippingAddress,
            user: user[0],
            product: product[0]
        }
        const newOrder =  this.orderRepository.create(orderData);
        await this.orderRepository.save(newOrder);

        const stocksLeft = inStock - quantity;
        const productData = {
            inStock: stocksLeft
        }
        this.updateProduct(productId, productData);
        return newOrder;
    }

    // updates the product details about inStock accordingly to the quantity
    async updateProduct(productId: number, data: Partial<ProductDTO>){
        await this.productRepository.update(productId, data);
    }

    async cancelOrder(id: number){
        return await this.orderRepository.delete(id);
    }
}