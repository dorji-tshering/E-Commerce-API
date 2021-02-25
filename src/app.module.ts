/* eslint-disable prettier/prettier */
import {Connection} from 'typeorm';
import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/product.module';
import { ProfileModule } from './profile/profile.module';
import { OrderModule } from './orders/order.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductModule, TypeOrmModule.forRoot(), 
            ProfileModule, OrderModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection){}  
}
