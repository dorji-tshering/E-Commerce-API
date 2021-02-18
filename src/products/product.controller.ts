/* eslint-disable prettier/prettier */
import {Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ProductDTO } from './product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService){}  
    
    @Post('add')
    addProduct(@Body() data: ProductDTO){
        return this.productService.createProduct(data);
    }

    @Patch('update/:id')
    updateProduct(@Param('id') id: number, @Body() data: ProductDTO){
        return this.productService.updateProduct(id, data);
    }

}