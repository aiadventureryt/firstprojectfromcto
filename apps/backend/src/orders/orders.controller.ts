import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Order } from '@workspace/shared';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  private mockOrders: Order[] = [
    {
      id: '1',
      userId: '1',
      orderNumber: 'ORD-001',
      status: 'delivered',
      items: [
        {
          id: '1',
          productId: 'prod-1',
          productName: 'Wireless Headphones',
          productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
          quantity: 1,
          price: 99.99,
          total: 99.99,
        },
        {
          id: '2',
          productId: 'prod-2',
          productName: 'Phone Case',
          productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300',
          quantity: 2,
          price: 19.99,
          total: 39.98,
        },
      ],
      subtotal: 139.97,
      tax: 11.20,
      shipping: 5.00,
      total: 156.17,
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      paymentMethod: 'Credit Card',
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString(),
      estimatedDelivery: new Date('2024-01-20').toISOString(),
      trackingNumber: 'TRACK123456789',
    },
    {
      id: '2',
      userId: '1',
      orderNumber: 'ORD-002',
      status: 'processing',
      items: [
        {
          id: '3',
          productId: 'prod-3',
          productName: 'Laptop Stand',
          productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
          quantity: 1,
          price: 49.99,
          total: 49.99,
        },
      ],
      subtotal: 49.99,
      tax: 4.00,
      shipping: 5.00,
      total: 58.99,
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      paymentMethod: 'PayPal',
      createdAt: new Date('2024-01-18').toISOString(),
      updatedAt: new Date('2024-01-18').toISOString(),
    },
    {
      id: '3',
      userId: '1',
      orderNumber: 'ORD-003',
      status: 'pending',
      items: [
        {
          id: '4',
          productId: 'prod-4',
          productName: 'Wireless Mouse',
          productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
          quantity: 1,
          price: 29.99,
          total: 29.99,
        },
        {
          id: '5',
          productId: 'prod-5',
          productName: 'USB Cable',
          productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300',
          quantity: 3,
          price: 9.99,
          total: 29.97,
        },
      ],
      subtotal: 59.96,
      tax: 4.80,
      shipping: 5.00,
      total: 69.76,
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      paymentMethod: 'Credit Card',
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString(),
    },
  ];

  @Get()
  @ApiOperation({ summary: 'Get all orders for current user' })
  @ApiResponse({ status: 200, description: 'List of orders', type: [Order] })
  async getOrders() {
    return {
      success: true,
      data: this.mockOrders,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order details', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(@Param('id') id: string) {
    const order = this.mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return {
      success: true,
      data: order,
    };
  }
}