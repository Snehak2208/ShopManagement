import User from '../Models/userModel.js';

// Middleware to check if user is a shopkeeper
export const requireShopkeeper = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        
        if (user.role !== 'shopkeeper') {
            return res.status(403).json({ status: false, message: "Access denied. Shopkeeper role required." });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error });
    }
};

// Middleware to check if user is a customer
export const requireCustomer = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        
        if (user.role !== 'customer') {
            return res.status(403).json({ status: false, message: "Access denied. Customer role required." });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error });
    }
};

// Middleware to check if user is either shopkeeper or customer
export const requireAnyRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        
        if (user.role !== 'shopkeeper' && user.role !== 'customer') {
            return res.status(403).json({ status: false, message: "Access denied. Invalid role." });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error });
    }
}; 