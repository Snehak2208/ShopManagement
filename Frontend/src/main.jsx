import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import NewSales from './Pages/NewSales/NewSales.jsx';
import Cart from './Pages/Cart';

import { Provider } from 'react-redux'
import { store } from './Redux/Store.js';
import Auth from './Pages/Auth/Auth.jsx';
import ViewSales from './Pages/ViewSales/ViewSales.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import CustomerDashboard from './Pages/CustomerDashboard/CustomerDashboard.jsx';
import PurchaseHistory from './Pages/PurchaseHistory/PurchaseHistory.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Redirect root directly to login page */}
      <Route path="" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/newSales" element={<NewSales />} />
      <Route path="/viewSales" element={<ViewSales/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/purchases" element={<PurchaseHistory />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)