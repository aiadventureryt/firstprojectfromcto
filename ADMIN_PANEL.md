# Admin Panel Implementation

## Overview

A complete admin panel has been implemented for the Next.js application with role-based access control, CRUD operations for managing system resources, and an analytics dashboard.

## Features

### 1. **Role-Based Access Control**
- Admin-only routes protected with `ProtectedRoute` component
- Authentication state managed via localStorage with `AuthUser` interface
- Mock authentication system for demonstration (login button on home page)
- Automatic redirection for unauthorized access

### 2. **Admin Dashboard**
- **Analytics Overview**: Key metrics displayed as cards
  - Total Users
  - Total Orders
  - Pending Orders
  - Total Revenue
  - Total Products
  - Average Order Value
- **Charts Placeholder**: Ready for integration with charting libraries
  - Suggestions: Chart.js, Recharts, Victory Charts

### 3. **Management Sections**

#### Users Management
- List all users with pagination and search
- Create new users with role assignment
- Edit user details (name, email, role)
- Delete users with confirmation
- Role badges (admin/user)

#### Products Management
- Browse products with stock information
- Create new products
- Edit product details (name, description, price, stock)
- Delete products with confirmation
- Price and stock display with visual indicators

#### Orders Management
- View all orders with detailed information
- Update order status (pending → completed → cancelled)
- Delete orders (with confirmation)
- Color-coded status badges
- Pagination and filtering support

#### Payments Management
- Track all payments
- Update payment status (pending → completed → failed)
- Delete payment records
- Payment method information
- Status-based color coding

## Architecture

### Backend (NestJS)

**Admin Module** (`apps/backend/src/admin/`)

- **AdminService**: Business logic for all CRUD operations
  - In-memory data store with sample data
  - Pagination support (page, limit, pages calculation)
  - Search and filter capabilities
  
- **AdminController**: REST API endpoints
  - `/admin/analytics` - GET analytics metrics
  - `/admin/users` - CRUD operations for users
  - `/admin/products` - CRUD operations for products
  - `/admin/orders` - CRUD operations for orders
  - `/admin/payments` - CRUD operations for payments

**API Endpoints**:
```
GET    /admin/analytics                    Get analytics metrics
GET    /admin/users?page=1&limit=10       Get paginated users
GET    /admin/users/:id                   Get user details
POST   /admin/users                       Create user
PUT    /admin/users/:id                   Update user
DELETE /admin/users/:id                   Delete user

GET    /admin/products?page=1&limit=10   Get paginated products
GET    /admin/products/:id                Get product details
POST   /admin/products                    Create product
PUT    /admin/products/:id                Update product
DELETE /admin/products/:id                Delete product

GET    /admin/orders?page=1&limit=10     Get paginated orders
GET    /admin/orders/:id                  Get order details
PUT    /admin/orders/:id                  Update order
DELETE /admin/orders/:id                  Delete order

GET    /admin/payments?page=1&limit=10   Get paginated payments
GET    /admin/payments/:id                Get payment details
PUT    /admin/payments/:id                Update payment
DELETE /admin/payments/:id                Delete payment
```

### Frontend (Next.js)

**Directory Structure**:
```
apps/frontend/src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          Admin layout
│   │   ├── page.tsx            Dashboard
│   │   ├── users/page.tsx      Users management
│   │   ├── products/page.tsx   Products management
│   │   ├── orders/page.tsx     Orders management
│   │   └── payments/page.tsx   Payments management
│   └── page.tsx                Home page (with admin login)
├── components/
│   ├── AdminNav.tsx            Navigation sidebar
│   ├── ProtectedRoute.tsx      Access control wrapper
│   ├── DataTable.tsx           Generic table component
│   ├── Pagination.tsx          Pagination controls
│   └── ConfirmDialog.tsx       Confirmation modal
└── lib/
    ├── auth.ts                 Authentication utilities
    └── api.ts                  API client with error handling
```

### Shared Types (`packages/shared/src/index.ts`)

```typescript
// User type with role support
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// Product catalog
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// Order tracking
interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Payment management
interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Analytics
interface AnalyticsMetrics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
  pendingOrders: number;
}
```

## Components

### ProtectedRoute
Wrapper component that enforces access control:
- Checks authentication state
- Verifies admin role if required
- Shows loading state while checking
- Redirects to home page if unauthorized

### AdminNav
Sidebar navigation with:
- Navigation links to all admin sections
- User profile information
- Logout functionality
- Visual indicator for active page

### DataTable
Reusable table component:
- Generic type support
- Column configuration
- Edit/Delete action buttons
- Loading and empty states
- Responsive design

### Pagination
Smart pagination controls:
- Previous/Next navigation
- Direct page jumps
- Disabled state at boundaries
- Loading state support

### ConfirmDialog
Modal confirmation for destructive actions:
- Customizable title and message
- Danger mode styling for destructive actions
- Loading state during operation
- Callback handlers

## Usage

### Accessing the Admin Panel

1. **Home Page**: Click "Login as Admin" button
   ```
   This sets a mock admin user in localStorage
   ```

2. **Direct URL**: Navigate to `/admin`
   ```
   ProtectedRoute will redirect if not authenticated
   ```

3. **Admin Routes** (requires admin authentication):
   - Dashboard: `/admin`
   - Users: `/admin/users`
   - Products: `/admin/products`
   - Orders: `/admin/orders`
   - Payments: `/admin/payments`

### API Usage

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

// Get paginated users
const users = await apiGet('/admin/users?page=1&limit=10');

// Create a new user
const newUser = await apiPost('/admin/users', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
});

// Update user
const updated = await apiPut('/admin/users/1', {
  name: 'Jane Doe'
});

// Delete user
await apiDelete('/admin/users/1');
```

## Authentication & Authorization

### Current Implementation (Mock)

For demonstration purposes, authentication is handled via localStorage:

```typescript
// Set admin user
setMockAuthUser();

// Get current user
const user = getAuthUser();

// Check if admin
if (isAdmin()) {
  // Admin operations
}

// Logout
clearAuthUser();
```

### Future Implementation

For production, integrate with:
1. JWT-based authentication
2. Session management
3. Password hashing (bcrypt)
4. Email verification
5. OAuth providers (Google, GitHub, etc.)

## Error Handling

- **API Errors**: Caught and displayed in error messages
- **Network Issues**: Graceful fallback with retry capability
- **Validation**: Form validation before submission
- **Confirmation**: Destructive actions require confirmation dialogs

## Styling

- **No CSS Files**: Uses CSS-in-JS (inline styles)
- **Consistent Theme**: Purple gradient (`#667eea` to `#764ba2`)
- **Responsive Design**: Grid layouts with mobile fallbacks
- **Accessibility**: Semantic HTML, proper button states

## Data Storage

Currently uses in-memory storage in the backend. For production, integrate with:

1. **PostgreSQL** (recommended)
   - Configured in `DATABASE_URL` env var
   - Migration system ready

2. **MongoDB**
   - Document-based approach
   - Good for rapid development

3. **Firebase**
   - Serverless option
   - Real-time capabilities

## Next Steps & Enhancements

1. **Database Integration**
   - Replace in-memory storage with persistent database
   - Set up proper migrations and seeders

2. **Authentication**
   - Implement JWT-based auth
   - Add password reset functionality
   - Email verification system

3. **Charts & Visualization**
   - Integrate Recharts or Chart.js
   - Add time-series analytics
   - Export reports to PDF

4. **Advanced Features**
   - Bulk operations (select multiple, delete/update)
   - Custom filters and sorting
   - Export to CSV/Excel
   - Audit logging
   - User activity tracking

5. **Performance**
   - Implement caching (Redis)
   - Add request debouncing
   - Virtual scrolling for large lists

6. **Testing**
   - Unit tests for components
   - Integration tests for API
   - E2E tests for workflows

7. **Localization**
   - Multi-language support
   - Timezone handling

## Troubleshooting

### Backend Routes Not Registering
- Check that `AdminModule` is imported in `app.module.ts`
- Verify controller routes with correct path prefix

### Frontend Routes Not Loading
- Ensure `ProtectedRoute` component is properly wrapping pages
- Check localStorage for `auth_user` key
- Verify API URL in environment variables

### API Calls Failing
- Check backend is running on port 3001
- Verify `NEXT_PUBLIC_API_URL` is correctly set
- Check network tab in DevTools for request details

## Files Created/Modified

### New Files
- `apps/backend/src/admin/admin.service.ts`
- `apps/backend/src/admin/admin.controller.ts`
- `apps/backend/src/admin/admin.module.ts`
- `apps/frontend/src/app/admin/layout.tsx`
- `apps/frontend/src/app/admin/page.tsx`
- `apps/frontend/src/app/admin/users/page.tsx`
- `apps/frontend/src/app/admin/products/page.tsx`
- `apps/frontend/src/app/admin/orders/page.tsx`
- `apps/frontend/src/app/admin/payments/page.tsx`
- `apps/frontend/src/components/AdminNav.tsx`
- `apps/frontend/src/components/ProtectedRoute.tsx`
- `apps/frontend/src/components/DataTable.tsx`
- `apps/frontend/src/components/Pagination.tsx`
- `apps/frontend/src/components/ConfirmDialog.tsx`
- `apps/frontend/src/lib/auth.ts`
- `apps/frontend/src/lib/api.ts`

### Modified Files
- `apps/backend/src/app.module.ts` - Added AdminModule import
- `apps/frontend/src/app/page.tsx` - Added admin login demo
- `packages/shared/src/index.ts` - Added admin types and interfaces
