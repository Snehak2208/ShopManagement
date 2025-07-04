import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from './products/productSlice'
import loginReducer from './login/isLogin'
import saleReducer from './sales/saleSlice'
import userReducer from './user/userSlice'
import cartReducer from './cart/cartSlice'

const rootRecucer = combineReducers({
  product:productReducer,
  login:loginReducer,
  sale:saleReducer,
  user:userReducer,
  cart:cartReducer,
})
export const store = configureStore({
  reducer:rootRecucer,
})