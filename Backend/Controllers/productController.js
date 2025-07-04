import Product from "../Models/productModal.js";
import User from "../Models/userModel.js";
import Sale from '../Models/salesModal.js';

// Get all products (for customers to browse)
export const getAllProductsController = async (req, res) => {
    try {
        const products = await Product.find({}).populate('userId', 'email');
        return res.status(200).json({ status:true, data: products });
    } catch (error) {
        return res.status(404).json({ status:false, message: "failed to fetch products!", error })
    }
}

// Get user's own products (for shopkeepers)
export const getProductsController = async (req, res) => {
    try {
        // get user
        const user = await User.findOne({ _id:req.user.userId }).populate("products");
        if (!user){ return res.status(404).json({ status:false, message: "unauthorized user", error })};
        return res.status(200).json({ status:true, data: user.products });
    } catch (error) {
        return res.status(404).json({ status:false, message: "failed to fetch product!", error })
    }
}

export const insertProductController = async (req, res) => {
    const obj = req.body;
    try {
        // get user
        const user = await User.findOne({ _id:req.user.userId });
        if (!user){ return res.status(404).json({ status:false, message: "unauthorized user", error })};
        
        // Check if user is shopkeeper
        if (user.role !== 'shopkeeper') {
            return res.status(403).json({ status:false, message: "Only shopkeepers can add products" });
        }
        
        const product = await Product.create({...obj,userId:req.user.userId});
        user.products.push(product._id);
        await user.save();

        return res.status(200).json({ status:true, message: "product inserted" })
    } catch (error) {
        return res.status(404).json({ status:false, message: "failed to insert product!", error })
    }
}

export const updateProductController = async(req, res) => {
    const { productId, newdata } = req.body;
    try {
        // Check if user is shopkeeper and owns the product
        const user = await User.findOne({ _id:req.user.userId });
        if (!user){ return res.status(404).json({ status:false, message: "unauthorized user", error })};
        
        if (user.role !== 'shopkeeper') {
            return res.status(403).json({ status:false, message: "Only shopkeepers can update products" });
        }
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status:false, message: "Product not found" });
        }
        
        if (product.userId.toString() !== req.user.userId) {
            return res.status(403).json({ status:false, message: "You can only update your own products" });
        }
        
        await Product.findOneAndUpdate({ "_id": productId }, newdata);
        return res.status(200).json({ status:true, message: "product updated" })
    } catch (error) {
        return res.status(404).json({ status:false, message: "failed to update product!", error })
    }
}

export const deleteProductController = async(req, res) => {
    const { productId } = req.body;
    try {
        // get user
        const user = await User.findOne({ _id:req.user.userId });
        if (!user){ return res.status(404).json({ status:false, message: "unauthorized user", error })};
        
        // Check if user is shopkeeper
        if (user.role !== 'shopkeeper') {
            return res.status(403).json({ status:false, message: "Only shopkeepers can delete products" });
        }
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status:false, message: "Product not found" });
        }
        
        if (product.userId.toString() !== req.user.userId) {
            return res.status(403).json({ status:false, message: "You can only delete your own products" });
        }
        
        await Product.deleteOne({ "_id": productId });
        // delete product from user products array as well:
        const index = user.products.indexOf(productId);
        user.products.splice(index,1)
        await user.save();

        return res.status(200).json({ status:true, message: "product deleted" })
    } catch (error) {
        return res.status(404).json({ status:false, message: "failed to delete product!", error })
    }
}

// Get all customer sales for a product (for shopkeeper)
export const getProductCustomerSalesController = async (req, res) => {
  try {
    const { productId } = req.params;
    const shopkeeperId = req.user.userId;
    // Find all sales for this product and shopkeeper
    const sales = await Sale.find({ productId, shopkeeperId })
      .populate('customerId', 'email')
      .sort({ purchaseDate: -1 });
    const result = sales.map(sale => ({
      customerEmail: sale.customerId?.email || 'N/A',
      quantity: sale.quantity,
      total: sale.totalPrice,
      date: sale.purchaseDate,
    }));
    res.status(200).json({ status: true, sales: result });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to get customer sales', error });
  }
};