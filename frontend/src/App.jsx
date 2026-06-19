import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import './styles/global.css';

// Pages
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// Components
import Navbar from './components/Navbar';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageOrders from './pages/admin/ManageOrders';
import ManageProducts from './pages/admin/ManageProducts';
import Login from './pages/admin/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
  };

  return (
    <CartProvider>
      <Router>
        <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navbar /><main className="container mt-4 mb-4"><Home /></main></>} />
              <Route path="/checkout" element={<><Navbar /><main className="container mt-4 mb-4"><Checkout /></main></>} />
              <Route path="/order-success/:orderId" element={<><Navbar /><main className="container mt-4 mb-4"><OrderSuccess /></main></>} />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={isAuthenticated ? <AdminLayout onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
              >
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="products" element={<ManageProducts />} />
              </Route>

              {/* Redirect any other /admin path to /admin if not auth */}
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
