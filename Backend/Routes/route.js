import { Router } from "express";
import { getUserController, loginController, logoutController, registerController } from "../Controllers/authController.js";
import { deleteProductController, getProductsController, insertProductController, updateProductController, getAllProductsController } from "../Controllers/productController.js";
import { purchaseProductController, getCustomerPurchasesController, getShopkeeperSalesController } from "../Controllers/purchaseController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import { requireShopkeeper, requireCustomer, requireAnyRole } from "../Middleware/roleMiddleware.js";
import { createNewSaleController, deleteSaleController, getSalesController } from "../Controllers/salesController.js";

export const route = Router();

// auth endpoint:
route.post("/login", loginController);
route.post("/register", registerController);
route.get("/logout", logoutController);
route.get("/getUser", authMiddleware, getUserController);

// Product endpoints - Role-based access
// Get all products (for customers to browse)
route.get("/products/all", authMiddleware, requireAnyRole, getAllProductsController);

// Shopkeeper-only product management
route.get("/products/my", authMiddleware, requireShopkeeper, getProductsController); 
route.post("/insert", authMiddleware, requireShopkeeper, insertProductController); 
route.post("/update", authMiddleware, requireShopkeeper, updateProductController); 
route.post("/delete", authMiddleware, requireShopkeeper, deleteProductController); 

// Customer purchase endpoints
route.post("/purchase", authMiddleware, requireCustomer, purchaseProductController);
route.get("/purchases", authMiddleware, requireCustomer, getCustomerPurchasesController);

// Shopkeeper sales history
route.get("/sales/history", authMiddleware, requireShopkeeper, getShopkeeperSalesController);

// Legacy sales endpoints (keeping for backward compatibility)
route.get("/getsales", authMiddleware, getSalesController); 
route.post("/createsales", authMiddleware, createNewSaleController); 
route.post("/deletesales", authMiddleware, deleteSaleController); 