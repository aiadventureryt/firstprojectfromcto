import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SavedItem } from '@workspace/shared';

@ApiTags('saved-items')
@Controller('saved-items')
@UseGuards(JwtAuthGuard)
export class SavedItemsController {
  private mockSavedItems: SavedItem[] = [
    {
      id: '1',
      userId: '1',
      productId: 'prod-1',
      productName: 'Wireless Headphones',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      price: 99.99,
      originalPrice: 149.99,
      addedAt: new Date('2024-01-10').toISOString(),
      inStock: true,
      discount: 33,
    },
    {
      id: '2',
      userId: '1',
      productId: 'prod-2',
      productName: 'Laptop Stand',
      productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
      price: 49.99,
      addedAt: new Date('2024-01-12').toISOString(),
      inStock: true,
    },
    {
      id: '3',
      userId: '1',
      productId: 'prod-3',
      productName: 'Smart Watch',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      price: 299.99,
      originalPrice: 399.99,
      addedAt: new Date('2024-01-15').toISOString(),
      inStock: false,
      discount: 25,
    },
    {
      id: '4',
      userId: '1',
      productId: 'prod-4',
      productName: 'Phone Case',
      productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300',
      price: 19.99,
      addedAt: new Date('2024-01-18').toISOString(),
      inStock: true,
    },
    {
      id: '5',
      userId: '1',
      productId: 'prod-5',
      productName: 'Wireless Mouse',
      productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
      price: 29.99,
      originalPrice: 39.99,
      addedAt: new Date('2024-01-19').toISOString(),
      inStock: true,
      discount: 25,
    },
  ];

  @Get()
  @ApiOperation({ summary: 'Get all saved items for current user' })
  @ApiResponse({ status: 200, description: 'List of saved items', type: [SavedItem] })
  async getSavedItems() {
    return {
      success: true,
      data: this.mockSavedItems,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Save an item' })
  @ApiResponse({ status: 201, description: 'Item saved successfully', type: SavedItem })
  async saveItem(@Body() saveItemDto: { productId: string }) {
    // Mock saving an item
    const newItem: SavedItem = {
      id: Date.now().toString(),
      userId: '1',
      productId: saveItemDto.productId,
      productName: `Product ${saveItemDto.productId}`,
      price: Math.floor(Math.random() * 100) + 10,
      addedAt: new Date().toISOString(),
      inStock: true,
    };

    this.mockSavedItems.push(newItem);

    return {
      success: true,
      data: newItem,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a saved item' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async removeSavedItem(@Param('id') id: string) {
    const index = this.mockSavedItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Saved item not found');
    }

    this.mockSavedItems.splice(index, 1);

    return {
      success: true,
      message: 'Item removed successfully',
    };
  }
}