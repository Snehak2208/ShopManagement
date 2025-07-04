import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCart, removeFromCart, checkoutCart, clearCheckoutResult } from '../../Redux/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, checkoutResult } = useSelector(state => state.cart);
  const userRole = useSelector(state => state.user.userRole);
  const [quantities, setQuantities] = useState({});
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (userRole !== 'customer') {
      navigate('/');
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, userRole, navigate]);

  useEffect(() => {
    // Sync local quantities with cart items
    const q = {};
    (items || []).forEach(item => {
      q[item.product._id] = item.quantity;
    });
    setQuantities(q);
  }, [items]);

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
  };

  const handleUpdate = (productId) => {
    dispatch(updateCart({ productId, quantity: Number(quantities[productId]) }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    dispatch(checkoutCart(comment));
  };

  const total = (items || []).reduce((sum, item) => sum + item.product.p_price * item.quantity, 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {(items || []).length === 0 && !loading && <p>Your cart is empty.</p>}
      {(items || []).length > 0 && (
        <table className="w-full mb-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Product</th>
              <th className="p-2">Price</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Subtotal</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map(item => (
              <tr key={item.product._id} className="border-t">
                <td className="p-2">{item.product.p_name}</td>
                <td className="p-2">₹{item.product.p_price}</td>
                <td className="p-2">
                  <input
                    type="number"
                    min="1"
                    value={quantities[item.product._id] || item.quantity}
                    onChange={e => handleQuantityChange(item.product._id, e.target.value)}
                    className="w-16 border rounded px-2 py-1"
                  />
                  <button
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => handleUpdate(item.product._id)}
                  >Update</button>
                </td>
                <td className="p-2">₹{item.product.p_price * item.quantity}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleRemove(item.product._id)}
                  >Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(items || []).length > 0 && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Add a comment to your bill (optional):</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Enter a note or instruction for your bill..."
              maxLength={200}
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total: ₹{total}</span>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleCheckout}
              disabled={loading}
            >Checkout</button>
          </div>
        </>
      )}
      {checkoutResult && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          <p>{checkoutResult.message}</p>
          <button className="mt-2 underline" onClick={() => dispatch(clearCheckoutResult())}>Dismiss</button>
          {checkoutResult.bill && (
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2 text-green-900">Bill Summary</h3>
              {checkoutResult.comment && (
                <div className="mb-2 p-2 bg-blue-50 text-blue-900 rounded">
                  <b>Note:</b> {checkoutResult.comment}
                </div>
              )}
              <table className="w-full border mb-2 bg-white text-black">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Product</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {checkoutResult.bill.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">₹{item.price}</td>
                      <td className="p-2">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="p-2 font-bold text-right">Total</td>
                    <td className="p-2 font-bold">₹{checkoutResult.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart; 