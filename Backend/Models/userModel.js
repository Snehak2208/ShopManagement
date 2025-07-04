import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true , 'password is required']
  },
  role: {
    type: String,
    enum: ['shopkeeper', 'customer'],
    default: 'shopkeeper'
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  sales: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale"
    }
  ],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ],
});

const User = mongoose.model('User', userSchema);

export default User;