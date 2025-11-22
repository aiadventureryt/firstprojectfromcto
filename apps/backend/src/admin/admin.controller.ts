import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  User,
  Product,
  Order,
  Payment,
  PaginatedResponse,
  AnalyticsMetrics,
} from '@workspace/shared';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  getAnalytics(): AnalyticsMetrics {
    return this.adminService.getAnalytics();
  }

  @Get('users')
  getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): PaginatedResponse<User> {
    return this.adminService.getUsers(parseInt(page), parseInt(limit));
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string): User | { error: string } {
    const user = this.adminService.getUserById(id);
    if (!user) {
      return { error: 'User not found' };
    }
    return user;
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    return this.adminService.createUser(data);
  }

  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() data: Partial<User>
  ): User | { error: string } {
    const user = this.adminService.updateUser(id, data);
    if (!user) {
      return { error: 'User not found' };
    }
    return user;
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string): { success: boolean; error?: string } {
    const success = this.adminService.deleteUser(id);
    if (!success) {
      return { success: false, error: 'User not found' };
    }
    return { success };
  }

  @Get('products')
  getProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): PaginatedResponse<Product> {
    return this.adminService.getProducts(parseInt(page), parseInt(limit));
  }

  @Get('products/:id')
  getProductById(@Param('id') id: string): Product | { error: string } {
    const product = this.adminService.getProductById(id);
    if (!product) {
      return { error: 'Product not found' };
    }
    return product;
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  createProduct(
    @Body() data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Product {
    return this.adminService.createProduct(data);
  }

  @Put('products/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() data: Partial<Product>
  ): Product | { error: string } {
    const product = this.adminService.updateProduct(id, data);
    if (!product) {
      return { error: 'Product not found' };
    }
    return product;
  }

  @Delete('products/:id')
  deleteProduct(
    @Param('id') id: string
  ): { success: boolean; error?: string } {
    const success = this.adminService.deleteProduct(id);
    if (!success) {
      return { success: false, error: 'Product not found' };
    }
    return { success };
  }

  @Get('orders')
  getOrders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): PaginatedResponse<Order> {
    return this.adminService.getOrders(parseInt(page), parseInt(limit));
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: string): Order | { error: string } {
    const order = this.adminService.getOrderById(id);
    if (!order) {
      return { error: 'Order not found' };
    }
    return order;
  }

  @Put('orders/:id')
  updateOrder(
    @Param('id') id: string,
    @Body() data: Partial<Order>
  ): Order | { error: string } {
    const order = this.adminService.updateOrder(id, data);
    if (!order) {
      return { error: 'Order not found' };
    }
    return order;
  }

  @Delete('orders/:id')
  deleteOrder(
    @Param('id') id: string
  ): { success: boolean; error?: string } {
    const success = this.adminService.deleteOrder(id);
    if (!success) {
      return { success: false, error: 'Order not found' };
    }
    return { success };
  }

  @Get('payments')
  getPayments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): PaginatedResponse<Payment> {
    return this.adminService.getPayments(parseInt(page), parseInt(limit));
  }

  @Get('payments/:id')
  getPaymentById(@Param('id') id: string): Payment | { error: string } {
    const payment = this.adminService.getPaymentById(id);
    if (!payment) {
      return { error: 'Payment not found' };
    }
    return payment;
  }

  @Put('payments/:id')
  updatePayment(
    @Param('id') id: string,
    @Body() data: Partial<Payment>
  ): Payment | { error: string } {
    const payment = this.adminService.updatePayment(id, data);
    if (!payment) {
      return { error: 'Payment not found' };
    }
    return payment;
  }

  @Delete('payments/:id')
  deletePayment(
    @Param('id') id: string
  ): { success: boolean; error?: string } {
    const success = this.adminService.deletePayment(id);
    if (!success) {
      return { success: false, error: 'Payment not found' };
    }
    return { success };
  }
}
