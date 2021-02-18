/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private orderservice: OrderService){}

    @Post('create/:userId/:productId')
    createOrder(@Param('userId') userId: number,
                 @Param('productId') productId: number, @Body('quantity') quantity: number){
        return this.orderservice.createOrder(userId, productId, quantity);
    }

    @Delete('delete/:id')
    deleteOrder(@Param('id') id: number){
        return this.orderservice.cancelOrder(id);
    }
}