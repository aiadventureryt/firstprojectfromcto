'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/Layout';
import { useSavedItems, useRemoveSavedItem } from '@/hooks/useSavedItems';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import {
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function SavedItemsPage() {
  const { data: savedItems, loading, error, refetch } = useSavedItems();
  const { removeItem } = useRemoveSavedItem();
  const [searchTerm, setSearchTerm] = useState('');
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const filteredItems = savedItems?.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    try {
      await removeItem(itemId);
      await refetch();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
            <div className="text-sm text-gray-500">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </div>
          </div>

          {error && (
            <Alert type="error" title="Error loading saved items">
              {error}
            </Alert>
          )}

          {/* Search */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search saved items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Saved Items Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => {
                const discount = calculateDiscount(item.price, item.originalPrice);
                const isRemoving = removingItems.has(item.id);

                return (
                  <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status badges */}
                      <div className="absolute top-2 left-2 right-2 flex justify-between">
                        {discount > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {discount}% OFF
                          </span>
                        )}
                        {!item.inStock && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemoving}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {isRemoving ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <TrashIcon className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.productName}
                      </h3>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      </div>

                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <span>Saved {new Date(item.addedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="mt-3 space-y-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          disabled={!item.inStock}
                        >
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No saved items</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search criteria.'
                  : 'Start saving items you love to see them here.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button variant="primary">
                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                    Start Shopping
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}