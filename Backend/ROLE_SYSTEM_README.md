# Role-Based Access Control System

This system now supports two distinct user roles: **Shopkeeper** and **Customer**.

## User Roles

### Shopkeeper
- Can add, update, and delete products
- Can view their own products
- Can view their sales history
- Cannot purchase products

### Customer
- Can browse all available products
- Can purchase products
- Can view their purchase history
- Cannot add, update, or delete products

## API Endpoints

### Authentication
- `POST /api/login` - Login with email, password
- `POST /api/register` - Register with email, password, role (optional, defaults to 'shopkeeper')
- `GET /api/logout` - Logout
- `GET /api/getUser` - Get current user info

### Product Management (Shopkeeper Only)
- `GET /api/products/my` - Get shopkeeper's own products
- `POST /api/insert` - Add new product
- `POST /api/update` - Update existing product
- `POST /api/delete` - Delete product

### Product Browsing (All Users)
- `GET /api/products/all` - Get all available products (for customers to browse)

### Customer Purchase System
- `POST /api/purchase` - Purchase a product (Customer only)
- `GET /api/purchases` - Get customer's purchase history

### Sales History
- `GET /api/sales/history` - Get shopkeeper's sales history

## Registration Examples

### Register as Shopkeeper
```json
POST /api/register
{
  "email": "shopkeeper@example.com",
  "password": "password123",
  "role": "shopkeeper"
}
```

### Register as Customer
```json
POST /api/register
{
  "email": "customer@example.com",
  "password": "password123",
  "role": "customer"
}
```

## Purchase Example

```json
POST /api/purchase
{
  "productId": "product_id_here",
  "quantity": 2
}
```

## Key Features

1. **Role-based Access Control**: Different permissions for different user types
2. **Product Ownership**: Shopkeepers can only manage their own products
3. **Stock Management**: Product stock is automatically updated when purchased
4. **Purchase History**: Both customers and shopkeepers can view their transaction history
5. **Backward Compatibility**: Existing functionality is preserved

## Security Features

- JWT-based authentication
- Role verification on protected endpoints
- Product ownership verification
- Stock validation before purchase

## Environment Variables Required

Make sure your `.env` file contains:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
PORT=8000
``` 