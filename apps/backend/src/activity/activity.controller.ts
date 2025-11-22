import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Activity } from '@workspace/shared';

@ApiTags('activity')
@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  private mockActivities: Activity[] = [
    {
      id: '1',
      userId: '1',
      type: 'order_placed',
      title: 'Order Placed',
      description: 'Order ORD-003 has been placed successfully',
      metadata: {
        orderNumber: 'ORD-003',
        amount: 69.76,
      },
      createdAt: new Date('2024-01-20T10:30:00Z').toISOString(),
    },
    {
      id: '2',
      userId: '1',
      type: 'item_saved',
      title: 'Item Saved',
      description: 'Wireless Mouse has been saved to your wishlist',
      metadata: {
        productId: 'prod-4',
        productName: 'Wireless Mouse',
      },
      createdAt: new Date('2024-01-19T15:45:00Z').toISOString(),
    },
    {
      id: '3',
      userId: '1',
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'Your profile information has been updated',
      createdAt: new Date('2024-01-18T09:15:00Z').toISOString(),
    },
    {
      id: '4',
      userId: '1',
      type: 'order_placed',
      title: 'Order Placed',
      description: 'Order ORD-002 has been placed successfully',
      metadata: {
        orderNumber: 'ORD-002',
        amount: 58.99,
      },
      createdAt: new Date('2024-01-18T14:20:00Z').toISOString(),
    },
    {
      id: '5',
      userId: '1',
      type: 'item_saved',
      title: 'Item Saved',
      description: 'Smart Watch has been saved to your wishlist',
      metadata: {
        productId: 'prod-3',
        productName: 'Smart Watch',
      },
      createdAt: new Date('2024-01-15T16:30:00Z').toISOString(),
    },
    {
      id: '6',
      userId: '1',
      type: 'order_placed',
      title: 'Order Delivered',
      description: 'Order ORD-001 has been delivered',
      metadata: {
        orderNumber: 'ORD-001',
        amount: 156.17,
      },
      createdAt: new Date('2024-01-20T16:00:00Z').toISOString(),
    },
    {
      id: '7',
      userId: '1',
      type: 'login',
      title: 'Login',
      description: 'You logged into your account',
      createdAt: new Date('2024-01-20T08:00:00Z').toISOString(),
    },
    {
      id: '8',
      userId: '1',
      type: 'item_saved',
      title: 'Item Saved',
      description: 'Phone Case has been saved to your wishlist',
      metadata: {
        productId: 'prod-2',
        productName: 'Phone Case',
      },
      createdAt: new Date('2024-01-12T11:20:00Z').toISOString(),
    },
    {
      id: '9',
      userId: '1',
      type: 'item_saved',
      title: 'Item Saved',
      description: 'Wireless Headphones has been saved to your wishlist',
      metadata: {
        productId: 'prod-1',
        productName: 'Wireless Headphones',
      },
      createdAt: new Date('2024-01-10T13:45:00Z').toISOString(),
    },
    {
      id: '10',
      userId: '1',
      type: 'login',
      title: 'Login',
      description: 'You logged into your account',
      createdAt: new Date('2024-01-10T08:30:00Z').toISOString(),
    },
  ];

  @Get()
  @ApiOperation({ summary: 'Get all activities for current user' })
  @ApiResponse({ status: 200, description: 'List of activities', type: [Activity] })
  async getActivities() {
    // Sort by date descending (newest first)
    const sortedActivities = [...this.mockActivities].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      data: sortedActivities,
    };
  }
}