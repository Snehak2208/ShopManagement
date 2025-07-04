import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../utils/baseurl';

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${baseUrl}/cart`, { withCredentials: true });
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${baseUrl}/cart/add`, { productId, quantity }, { withCredentials: true });
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${baseUrl}/cart/remove`, { productId }, { withCredentials: true });
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from cart');
  }
});

export const updateCart = createAsyncThunk('cart/updateCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${baseUrl}/cart/update`, { productId, quantity }, { withCredentials: true });
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update cart');
  }
});

export const checkoutCart = createAsyncThunk('cart/checkoutCart', async (comment, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${baseUrl}/cart/checkout`, { comment }, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Checkout failed');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    checkoutResult: null,
  },
  reducers: {
    clearCheckoutResult: (state) => {
      state.checkoutResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addToCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(removeFromCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(removeFromCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(updateCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(checkoutCart.pending, (state) => { state.loading = true; state.error = null; state.checkoutResult = null; })
      .addCase(checkoutCart.fulfilled, (state, action) => { state.loading = false; state.items = []; state.checkoutResult = action.payload; })
      .addCase(checkoutCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCheckoutResult } = cartSlice.actions;
export default cartSlice.reducer; 