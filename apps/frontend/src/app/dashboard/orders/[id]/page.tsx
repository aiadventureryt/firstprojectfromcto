'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/Layout';
import { useOrder } from '@/hooks/useOrders';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeftIcon,
  TruckIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { data: order, loading, error } = useOrder(orderId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircleIcon;
      case 'shipped':
        return TruckIcon;
      case 'processing':
        return ClockIcon;
      case 'cancelled':
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <Link href="/dashboard/orders" className="flex items-center text-primary-600 hover:text-primary-500">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
            <Alert type="error" title="Order not found">
              The order you're looking for could not be found or an error occurred.
            </Alert>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/orders" className="flex items-center text-primary-600 hover:text-primary-500">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {order.status}
            </div>
          </div>

          {error && (
            <Alert type="error" title="Error loading order">
              {error}
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                        <div className="flex items-center space-x-4">
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="h-16 w-16 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${item.price.toFixed(2)} each
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Summary</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">${order.subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Tax</dt>
                      <dd className="text-sm font-medium text-gray-900">${order.tax.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">${order.shipping.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <dt className="text-base font-medium text-gray-900">Total</dt>
                      <dd className="text-base font-bold text-gray-900">${order.total.toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                      <dd className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                      <dd className="text-sm text-gray-900">{order.paymentMethod}</dd>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
                        <dd className="text-sm text-gray-900">{order.trackingNumber}</dd>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
                        <dd className="text-sm text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Shipping Address
                  </h3>
                  <address className="text-sm text-gray-900 not-italic">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </address>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {order.status === 'delivered' && (
                  <Button variant="primary" className="w-full">
                    Reorder Items
                  </Button>
                )}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <Button variant="danger" className="w-full">
                    Cancel Order
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Download Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}