import User from '../Models/userModel.js';
import Product from '../Models/productModal.js';
import Sale from '../Models/salesModal.js';
import nodemailer from 'nodemailer';

// Add product to cart
export const addToCartController = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ status: false, message: 'Product not found' });
    // Check if already in cart
    const existing = user.cart.find(item => item.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    res.status(200).json({ status: true, message: 'Added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to add to cart', error });
  }
};

// Remove product from cart
export const removeFromCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    res.status(200).json({ status: true, message: 'Removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to remove from cart', error });
  }
};

// Update quantity in cart
export const updateCartController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });
    const item = user.cart.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ status: false, message: 'Product not in cart' });
    item.quantity = quantity;
    await user.save();
    res.status(200).json({ status: true, message: 'Cart updated', cart: user.cart });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to update cart', error });
  }
};

// Get current cart
export const getCartController = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.product');
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });
    res.status(200).json({ status: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to get cart', error });
  }
};

// Checkout cart and send bill email
export const checkoutCartController = async (req, res) => {
  try {
    const { comment } = req.body;
    console.log('Received comment:', comment);
    const user = await User.findById(req.user.userId).populate('cart.product');
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });
    if (!user.cart.length) return res.status(400).json({ status: false, message: 'Cart is empty' });
    let total = 0;
    let saleRecords = [];
    // Check stock and create sales
    for (const item of user.cart) {
      const product = await Product.findById(item.product._id);
      if (!product || product.p_stock < item.quantity) {
        return res.status(400).json({ status: false, message: `Insufficient stock for ${product?.p_name || 'product'}` });
      }
      product.p_stock -= item.quantity;
      await product.save();
      const sale = await Sale.create({
        productId: product._id,
        customerId: user._id,
        shopkeeperId: product.userId,
        quantity: item.quantity,
        totalPrice: product.p_price * item.quantity,
        purchaseDate: new Date()
      });
      user.sales.push(sale._id);
      const shopkeeper = await User.findById(product.userId);
      if (shopkeeper) {
        shopkeeper.sales.push(sale._id);
        await shopkeeper.save();
      }
      total += product.p_price * item.quantity;
      saleRecords.push({ name: product.p_name, price: product.p_price, quantity: item.quantity });
    }
    await user.save();
    // Clear cart
    user.cart = [];
    await user.save();
    // Send bill email (real implementation)
    await sendBillEmail(user.email, saleRecords, total, comment);
    res.status(200).json({ status: true, message: 'Purchase successful, bill sent to email', total, bill: saleRecords, comment });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Checkout failed', error });
  }
};

// Email utility (real implementation)
async function sendBillEmail(to, items, total, comment) {
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Build HTML bill
  let itemsHtml = items.map(item =>
    `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.price}</td><td>₹${item.price * item.quantity}</td></tr>`
  ).join('');
  const html = `
    <h2>Thank you for your purchase!</h2>
    <p>Here is your bill:</p>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead><tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot><tr><td colspan="3"><b>Total</b></td><td><b>₹${total}</b></td></tr></tfoot>
    </table>
    ${comment ? `<p><b>Note:</b> ${comment}</p>` : ''}
    <p>If you have any questions, reply to this email.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Shop Purchase Bill',
    html,
  });
} 