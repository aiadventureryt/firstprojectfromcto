import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@workspace/shared';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  private mockUser: User = {
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    preferences: {
      notifications: true,
      newsletter: false,
      theme: 'light',
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  };

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile', type: User })
  async getProfile() {
    return {
      success: true,
      data: this.mockUser,
    };
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: User })
  async updateProfile(@Body() updateDto: Partial<User>) {
    // Mock profile update
    this.mockUser = {
      ...this.mockUser,
      ...updateDto,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: this.mockUser,
    };
  }
}