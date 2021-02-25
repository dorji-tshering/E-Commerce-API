/* eslint-disable prettier/prettier */
import {Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductDTO } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}  
    
    @UseGuards(AuthGuard('adminauth'))
    @Post('add')
    addProduct(@Body() data: ProductDTO){
        return this.productService.createProduct(data);
    }

    @UseGuards(AuthGuard('adminauth'))
    @Patch('update/:id')
    updateProduct(@Param('id') id: number, @Body() data: Partial<ProductDTO>){
        return this.productService.updateProduct(id, data);
    }

}