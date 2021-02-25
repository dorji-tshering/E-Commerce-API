/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Post, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private orderservice: OrderService){}

    @UseGuards(JwtAuthGuard)
    @Post('create/:productId')
    createOrder(@Request() req, @Param('productId') id: number, @Body('quantity') quantity: number){
        return this.orderservice.createOrder(req.user.userId, id, quantity);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:orderId')
    deleteOrder(@Param('orderId') orderId: number, @Request() req){
        return this.orderservice.cancelOrder(orderId, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('get')
    async getOrders(@Request() req){
        return await this.orderservice.getOrders(req.user.userId);
    }
}