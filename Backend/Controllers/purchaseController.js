import Product from "../Models/productModal.js";
import User from "../Models/userModel.js";
import Sale from "../Models/salesModal.js";

// Customer purchases a product
export const purchaseProductController = async (req, res) => {
    try {
        console.log('=== PURCHASE ATTEMPT START ===');
        console.log('Request body:', req.body);
        console.log('User ID from token:', req.user.userId);
        
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            console.log('❌ No productId provided');
            return res.status(400).json({ status: false, message: "Product ID is required" });
        }
        
        console.log('Purchase attempt:', { productId, quantity, userId: req.user.userId });
        
        // Get user
        console.log('🔍 Finding user...');
        const user = await User.findOne({ _id: req.user.userId });
        if (!user) {
            console.log('❌ User not found for ID:', req.user.userId);
            return res.status(404).json({ status: false, message: "User not found" });
        }
        console.log('✅ User found:', { email: user.email, role: user.role });
        
        // Check if user is customer
        if (user.role !== 'customer') {
            console.log('❌ User is not a customer:', user.role);
            return res.status(403).json({ status: false, message: "Only customers can purchase products" });
        }
        
        // Get product
        console.log('🔍 Finding product...');
        const product = await Product.findById(productId);
        if (!product) {
            console.log('❌ Product not found for ID:', productId);
            return res.status(404).json({ status: false, message: "Product not found" });
        }
        
        console.log('✅ Product found:', { 
            productId: product._id, 
            name: product.p_name, 
            price: product.p_price, 
            stock: product.p_stock,
            shopkeeperId: product.userId
        });
        
        // Check if product has enough stock
        if (product.p_stock < quantity) {
            console.log('❌ Insufficient stock:', { requested: quantity, available: product.p_stock });
            return res.status(400).json({ status: false, message: "Insufficient stock" });
        }
        
        // Calculate total price
        const totalPrice = product.p_price * quantity;
        console.log('💰 Price calculation:', { unitPrice: product.p_price, quantity, totalPrice });
        
        // Create sale record
        console.log('📝 Creating sale record...');
        const saleData = {
            productId: product._id,
            customerId: user._id,
            shopkeeperId: product.userId,
            quantity: quantity,
            totalPrice: totalPrice,
            purchaseDate: new Date()
        };
        console.log('Sale data:', saleData);
        
        const sale = await Sale.create(saleData);
        console.log('✅ Sale created:', sale._id);
        
        // Update product stock
        console.log('📦 Updating product stock...');
        const oldStock = product.p_stock;
        product.p_stock -= quantity;
        await product.save();
        console.log('✅ Stock updated:', { oldStock, newStock: product.p_stock });
        
        // Add sale to user's sales array
        console.log('👤 Adding sale to customer...');
        user.sales.push(sale._id);
        await user.save();
        console.log('✅ Sale added to customer');
        
        // Add sale to shopkeeper's sales array
        console.log('🏪 Adding sale to shopkeeper...');
        const shopkeeper = await User.findById(product.userId);
        if (shopkeeper) {
            shopkeeper.sales.push(sale._id);
            await shopkeeper.save();
            console.log('✅ Sale added to shopkeeper');
        } else {
            console.log('⚠️ Shopkeeper not found for ID:', product.userId);
        }
        
        console.log('=== PURCHASE SUCCESSFUL ===');
        return res.status(200).json({ 
            status: true, 
            message: "Purchase successful", 
            data: {
                saleId: sale._id,
                productName: product.p_name,
                quantity: quantity,
                totalPrice: totalPrice
            }
        });
        
    } catch (error) {
        console.error('=== PURCHASE ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            status: false, 
            message: "Failed to process purchase", 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get customer's purchase history
export const getCustomerPurchasesController = async (req, res) => {
    try {
        console.log('🔍 Getting customer purchases for user:', req.user.userId);
        
        const user = await User.findOne({ _id: req.user.userId }).populate({
            path: 'sales',
            populate: {
                path: 'productId',
                select: 'p_name p_price p_thumbnail'
            }
        });
        
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ status: false, message: "User not found" });
        }
        
        if (user.role !== 'customer') {
            console.log('❌ User is not a customer:', user.role);
            return res.status(403).json({ status: false, message: "Only customers can view purchase history" });
        }
        
        console.log('✅ Found', user.sales.length, 'purchases for customer');
        return res.status(200).json({ status: true, data: user.sales });
        
    } catch (error) {
        console.error('Get purchases error:', error);
        return res.status(500).json({ status: false, message: "Failed to fetch purchase history", error: error.message });
    }
};

// Get shopkeeper's sales history
export const getShopkeeperSalesController = async (req, res) => {
    try {
        console.log('🔍 Getting shopkeeper sales for user:', req.user.userId);
        
        const user = await User.findOne({ _id: req.user.userId }).populate({
            path: 'sales',
            populate: [
                {
                    path: 'productId',
                    select: 'p_name p_price p_thumbnail'
                },
                {
                    path: 'customerId',
                    select: 'email'
                }
            ]
        });
        
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ status: false, message: "User not found" });
        }
        
        if (user.role !== 'shopkeeper') {
            console.log('❌ User is not a shopkeeper:', user.role);
            return res.status(403).json({ status: false, message: "Only shopkeepers can view sales history" });
        }
        
        console.log('✅ Found', user.sales.length, 'sales for shopkeeper');
        return res.status(200).json({ status: true, data: user.sales });
        
    } catch (error) {
        console.error('Get sales error:', error);
        return res.status(500).json({ status: false, message: "Failed to fetch sales history", error: error.message });
    }
}; 