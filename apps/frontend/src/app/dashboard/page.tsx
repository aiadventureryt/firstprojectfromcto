'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/Layout';
import { useOrders } from '@/hooks/useOrders';
import { useSavedItems } from '@/hooks/useSavedItems';
import { useActivity } from '@/hooks/useActivity';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  ShoppingBagIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: orders, loading: ordersLoading, error: ordersError } = useOrders();
  const { data: savedItems, loading: savedLoading, error: savedError } = useSavedItems();
  const { data: activities, loading: activitiesLoading, error: activitiesError } = useActivity();

  const stats = [
    {
      name: 'Total Orders',
      value: orders?.length || 0,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      href: '/dashboard/orders',
    },
    {
      name: 'Saved Items',
      value: savedItems?.length || 0,
      icon: HeartIcon,
      color: 'bg-pink-500',
      href: '/dashboard/saved-items',
    },
    {
      name: 'Pending Orders',
      value: orders?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      href: '/dashboard/orders',
    },
    {
      name: 'Total Spent',
      value: `$${orders?.reduce((sum, order) => sum + order.total, 0).toFixed(2) || '0.00'}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      href: '/dashboard/orders',
    },
  ];

  const recentOrders = orders?.slice(0, 5) || [];
  const recentActivities = activities?.slice(0, 5) || [];

  const isLoading = ordersLoading || savedLoading || activitiesLoading;
  const hasError = ordersError || savedError || activitiesError;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {hasError && (
          <div className="mb-6">
            <Alert type="error" title="Error loading data">
              Some information could not be loaded. Please try refreshing the page.
            </Alert>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Link
                  key={stat.name}
                  href={stat.href}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`${stat.color} rounded-md p-3`}>
                          <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {stat.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Orders */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Orders
                    </h3>
                    <Link
                      href="/dashboard/orders"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View all
                    </Link>
                  </div>
                  {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ${order.total.toFixed(2)}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No orders yet</p>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Activity
                    </h3>
                    <Link
                      href="/dashboard/activity"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View all
                    </Link>
                  </div>
                  {recentActivities.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start py-2 border-b border-gray-200 last:border-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}