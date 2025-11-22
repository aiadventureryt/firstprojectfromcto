import { Injectable } from '@nestjs/common';
import {
  User,
  Product,
  Order,
  Payment,
  PaginatedResponse,
  AnalyticsMetrics,
} from '@workspace/shared';

@Injectable()
export class AdminService {
  private users: User[] = [
    {
      id: '1',
      email: 'user1@example.com',
      name: 'John Doe',
      role: 'user',
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    },
    {
      id: '2',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    },
    {
      id: '3',
      email: 'user2@example.com',
      name: 'Jane Smith',
      role: 'user',
      createdAt: new Date('2024-01-02').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString(),
    },
  ];

  private products: Product[] = [
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 1200,
      stock: 15,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    },
    {
      id: '2',
      name: 'Mouse',
      description: 'Wireless mouse',
      price: 25,
      stock: 100,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    },
    {
      id: '3',
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 80,
      stock: 50,
      createdAt: new Date('2024-01-02').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString(),
    },
  ];

  private orders: Order[] = [
    {
      id: '1',
      userId: '1',
      productId: '1',
      quantity: 1,
      totalPrice: 1200,
      status: 'completed',
      createdAt: new Date('2024-01-05').toISOString(),
      updatedAt: new Date('2024-01-05').toISOString(),
    },
    {
      id: '2',
      userId: '3',
      productId: '2',
      quantity: 2,
      totalPrice: 50,
      status: 'pending',
      createdAt: new Date('2024-01-10').toISOString(),
      updatedAt: new Date('2024-01-10').toISOString(),
    },
    {
      id: '3',
      userId: '1',
      productId: '3',
      quantity: 1,
      totalPrice: 80,
      status: 'completed',
      createdAt: new Date('2024-01-12').toISOString(),
      updatedAt: new Date('2024-01-12').toISOString(),
    },
  ];

  private payments: Payment[] = [
    {
      id: '1',
      orderId: '1',
      amount: 1200,
      status: 'completed',
      method: 'credit_card',
      createdAt: new Date('2024-01-05').toISOString(),
      updatedAt: new Date('2024-01-05').toISOString(),
    },
    {
      id: '2',
      orderId: '2',
      amount: 50,
      status: 'pending',
      method: 'paypal',
      createdAt: new Date('2024-01-10').toISOString(),
      updatedAt: new Date('2024-01-10').toISOString(),
    },
    {
      id: '3',
      orderId: '3',
      amount: 80,
      status: 'completed',
      method: 'credit_card',
      createdAt: new Date('2024-01-12').toISOString(),
      updatedAt: new Date('2024-01-12').toISOString(),
    },
  ];

  getUsers(page: number = 1, limit: number = 10): PaginatedResponse<User> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = this.users.slice(start, end);
    return {
      items,
      total: this.users.length,
      page,
      limit,
      pages: Math.ceil(this.users.length / limit),
    };
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user: User = {
      ...data,
      id: String(this.users.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  updateUser(id: string, data: Partial<User>): User | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;

    const user = {
      ...this.users[index],
      ...data,
      id: this.users[index].id,
      createdAt: this.users[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.users[index] = user;
    return user;
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  getProducts(page: number = 1, limit: number = 10): PaginatedResponse<Product> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = this.products.slice(start, end);
    return {
      items,
      total: this.products.length,
      page,
      limit,
      pages: Math.ceil(this.products.length / limit),
    };
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  createProduct(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Product {
    const product: Product = {
      ...data,
      id: String(this.products.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.push(product);
    return product;
  }

  updateProduct(id: string, data: Partial<Product>): Product | undefined {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const product = {
      ...this.products[index],
      ...data,
      id: this.products[index].id,
      createdAt: this.products[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.products[index] = product;
    return product;
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  getOrders(page: number = 1, limit: number = 10): PaginatedResponse<Order> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = this.orders.slice(start, end);
    return {
      items,
      total: this.orders.length,
      page,
      limit,
      pages: Math.ceil(this.orders.length / limit),
    };
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  updateOrder(id: string, data: Partial<Order>): Order | undefined {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;

    const order = {
      ...this.orders[index],
      ...data,
      id: this.orders[index].id,
      createdAt: this.orders[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.orders[index] = order;
    return order;
  }

  deleteOrder(id: string): boolean {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return false;
    this.orders.splice(index, 1);
    return true;
  }

  getPayments(page: number = 1, limit: number = 10): PaginatedResponse<Payment> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = this.payments.slice(start, end);
    return {
      items,
      total: this.payments.length,
      page,
      limit,
      pages: Math.ceil(this.payments.length / limit),
    };
  }

  getPaymentById(id: string): Payment | undefined {
    return this.payments.find((p) => p.id === id);
  }

  updatePayment(id: string, data: Partial<Payment>): Payment | undefined {
    const index = this.payments.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const payment = {
      ...this.payments[index],
      ...data,
      id: this.payments[index].id,
      createdAt: this.payments[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.payments[index] = payment;
    return payment;
  }

  deletePayment(id: string): boolean {
    const index = this.payments.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.payments.splice(index, 1);
    return true;
  }

  getAnalytics(): AnalyticsMetrics {
    const totalRevenue = this.orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const completedOrders = this.orders.filter(
      (o) => o.status === 'completed'
    ).length;
    const pendingOrders = this.orders.filter(
      (o) => o.status === 'pending'
    ).length;

    return {
      totalUsers: this.users.length,
      totalOrders: this.orders.length,
      totalRevenue,
      averageOrderValue:
        completedOrders > 0 ? totalRevenue / completedOrders : 0,
      totalProducts: this.products.length,
      pendingOrders,
    };
  }
}
