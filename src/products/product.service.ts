/* eslint-disable prettier/prettier */
import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDTO } from './product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>){}

        async createProduct(data: ProductDTO){
            const newProduct = this.productRepository.create(data);
            return await this.productRepository.save(newProduct);
        }

        async updateProduct(id: number, data: Partial<ProductDTO>){
            const updatedProduct = await this.productRepository.update(id, data);
            return updatedProduct;
        }
}