# 🏪 Shop Inventory Management System

A comprehensive MERN stack application for managing shop inventory with role-based access control for shopkeepers and customers.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Role-Based Access Control](#-role-based-access-control)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Role-based access control (Shopkeeper/Customer)
- JWT token-based authentication
- Secure password hashing with bcrypt

### 🏪 Shopkeeper Features
- **Product Management**: Add, update, delete products
- **Inventory Tracking**: Monitor stock levels
- **Sales Management**: Create and view sales records
- **Dashboard**: Overview of products and sales

### 🛒 Customer Features
- **Browse Products**: View available products
- **Purchase Products**: Buy products with quantity selection
- **Purchase History**: View past purchases
- **Customer Dashboard**: Personalized shopping experience

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- DaisyUI components for consistent styling
- Dark/Light theme support
- Mobile-friendly interface

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Vite** - Build tool
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shop-inventory-management-MERN/ShopManagement
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `Backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/shop-inventory
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop-inventory

JWT_SECRET_KEY=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
PORT=5000
```

### Frontend Configuration

Update the base URL in `Frontend/src/utils/baseurl.js`:

```javascript
const baseurl = "http://localhost:5000";
export default baseurl;
```

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server

```bash
cd Backend
npm start
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
cd Frontend
npm run dev
```

The frontend application will start on `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
shop-inventory-management-MERN/
├── ShopManagement/
│   ├── Backend/
│   │   ├── Controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── purchaseController.js
│   │   │   └── salesController.js
│   │   ├── Middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── Models/
│   │   │   ├── userModel.js
│   │   │   ├── productModal.js
│   │   │   └── salesModal.js
│   │   ├── Routes/
│   │   │   └── route.js
│   │   ├── Db/
│   │   │   └── connectDB.js
│   │   ├── index.js
│   │   ├── package.json
│   │   └── .env
│   └── Frontend/
│       ├── src/
│       │   ├── Components/
│       │   │   ├── Aside/
│       │   │   ├── Modal/
│       │   │   └── Navbar/
│       │   ├── Pages/
│       │   │   ├── Auth/
│       │   │   ├── Dashboard/
│       │   │   ├── CustomerDashboard/
│       │   │   └── PurchaseHistory/
│       │   ├── Redux/
│       │   │   ├── Store.js
│       │   │   ├── login/
│       │   │   ├── products/
│       │   │   ├── sales/
│       │   │   └── user/
│       │   └── utils/
│       ├── package.json
│       └── index.html
```

## 🔌 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

### Products (Shopkeeper Only)
- `GET /products/my` - Get shopkeeper's products
- `POST /products/add` - Add new product
- `PUT /products/update/:id` - Update product
- `DELETE /products/delete/:id` - Delete product

### Products (Customer)
- `GET /products/all` - Get all available products

### Purchases (Customer Only)
- `POST /purchase` - Purchase products
- `GET /purchases/my` - Get customer's purchase history

### Sales (Shopkeeper Only)
- `POST /sales/add` - Add new sale
- `GET /sales/my` - Get shopkeeper's sales

## 👥 Role-Based Access Control

### Shopkeeper Role
- **Dashboard**: Manage products and view sales
- **Products**: Add, update, delete products
- **Sales**: Create and view sales records
- **Profile**: Manage account settings

### Customer Role
- **Dashboard**: Browse available products
- **Products**: View product details and prices
- **Purchases**: Buy products and view history
- **Profile**: Manage account settings

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is running locally
- Check your MongoDB connection string in `.env`
- For MongoDB Atlas, verify your connection string and network access

#### 2. JWT Secret Key Error
```
Error: jwt must be provided
```
**Solution**: 
- Ensure `JWT_SECRET_KEY` is set in your `.env` file
- Restart the backend server after adding the environment variable

#### 3. CORS Error
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution**: 
- Verify `CORS_ORIGIN` in backend `.env` matches your frontend URL
- Ensure backend server is running

#### 4. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
- Change the port in backend `.env` file
- Update frontend base URL accordingly
- Or kill the process using the port

### Database Issues

#### Sales Unique Index Error
If you encounter unique index errors on sales:
```bash
cd Backend
node fix-sales-unique-index.js
```

### Testing Scripts

The project includes several test scripts for debugging:

```bash
# Test authentication
cd Backend
node test-auth.js

# Test purchase functionality
node test-purchase.js

# Test sales model
node test-sales-model.js
```

## 🔧 Development

### Adding New Features

1. **Backend**: Add controllers, models, and routes
2. **Frontend**: Create components and pages
3. **Redux**: Update state management if needed
4. **Testing**: Test thoroughly before deployment

### Code Style

- Use consistent indentation (2 spaces)
- Follow JavaScript/React best practices
- Add comments for complex logic
- Use meaningful variable and function names

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the existing documentation
3. Create an issue with detailed information
4. Include error messages and steps to reproduce

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Multi-shop support
- [ ] Inventory alerts
- [ ] Payment integration
- [ ] Mobile app
- [ ] Barcode scanning
- [ ] Export functionality (PDF/Excel)

---

**Happy Coding! 🚀** 