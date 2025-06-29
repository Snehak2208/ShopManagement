import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
    // Legacy fields for backward compatibility (all optional)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    cust_name: {
        type: String,
        required: false,
        default: null
    },
    cust_email: {
        type: String,
        required: false,
        default: null,
        index: false // Explicitly disable indexing
    },
    cust_contact: {
        type: String,
        required: false,
        default: null
    },
    cartItems: {
        type: Array,
        default: [],
    },
    
    // New fields for role-based system
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true // Required for new system
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Required for new system
    },
    shopkeeperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Required for new system
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Ensure no unique constraints are applied
salesSchema.index({ cust_email: 1 }, { unique: false });

const Sale = mongoose.model('Sale', salesSchema);

export default Sale;