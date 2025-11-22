'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/Layout';
import { useActivity } from '@/hooks/useActivity';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  UserIcon,
  ShoppingBagIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ActivityPage() {
  const { data: activities, loading, error } = useActivity();
  const [filter, setFilter] = useState<string>('all');

  const filteredActivities = activities?.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  }) || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order_placed':
        return ShoppingBagIcon;
      case 'order_cancelled':
        return XCircleIcon;
      case 'item_saved':
        return HeartIcon;
      case 'item_removed':
        return HeartIcon;
      case 'profile_updated':
        return UserIcon;
      case 'login':
        return CheckCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order_placed':
        return 'bg-blue-100 text-blue-600';
      case 'order_cancelled':
        return 'bg-red-100 text-red-600';
      case 'item_saved':
        return 'bg-pink-100 text-pink-600';
      case 'item_removed':
        return 'bg-gray-100 text-gray-600';
      case 'profile_updated':
        return 'bg-green-100 text-green-600';
      case 'login':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const activityTypes = [
    { value: 'all', label: 'All Activity' },
    { value: 'order_placed', label: 'Orders' },
    { value: 'item_saved', label: 'Saved Items' },
    { value: 'profile_updated', label: 'Profile Updates' },
    { value: 'login', label: 'Login Activity' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ClockIcon className="h-4 w-4" />
              <span>Showing recent activity</span>
            </div>
          </div>

          {error && (
            <Alert type="error" title="Error loading activity">
              {error}
            </Alert>
          )}

          {/* Filter */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilter(type.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === type.value
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const iconColor = getActivityColor(activity.type);
                  
                  return (
                    <li key={activity.id} className={index === 0 ? 'hover:bg-gray-50' : ''}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 p-2 rounded-full ${iconColor}`}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </p>
                              <time className="text-xs text-gray-500">
                                {formatRelativeTime(activity.createdAt)}
                              </time>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.description}
                            </p>
                            
                            {/* Additional metadata */}
                            {activity.metadata && (
                              <div className="mt-2 space-y-1">
                                {activity.metadata.orderNumber && (
                                  <p className="text-xs text-gray-500">
                                    Order #{activity.metadata.orderNumber}
                                  </p>
                                )}
                                {activity.metadata.productName && (
                                  <p className="text-xs text-gray-500">
                                    Product: {activity.metadata.productName}
                                  </p>
                                )}
                                {activity.metadata.amount && (
                                  <p className="text-xs text-gray-500">
                                    Amount: ${activity.metadata.amount}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No activity found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter !== 'all' 
                  ? 'No activity matches the selected filter.'
                  : 'Your activity will appear here as you use the platform.'}
              </p>
            </div>
          )}

          {/* Activity Summary */}
          {activities && activities.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Activity Summary</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {activities.filter(a => a.type === 'order_placed').length}
                  </div>
                  <div className="text-sm text-gray-500">Orders Placed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {activities.filter(a => a.type === 'item_saved').length}
                  </div>
                  <div className="text-sm text-gray-500">Items Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {activities.filter(a => a.type === 'profile_updated').length}
                  </div>
                  <div className="text-sm text-gray-500">Profile Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {activities.filter(a => a.type === 'login').length}
                  </div>
                  <div className="text-sm text-gray-500">Logins</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}