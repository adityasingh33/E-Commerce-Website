import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext.jsx';
import Auth from './pages/Auth.jsx';
import Seller from './pages/Seller.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ProductDetail from './pages/ProductDetail.jsx'; // <-- 1. Import the new page
import Navbar from './components/Navbar';
import Cart from './pages/Cart.jsx';

// Your ProtectedRoute component here...
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};


const App = () => {
    return (
        <AuthProvider>
            <Router>
               <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/product/:id" element={<ProductDetail />} /> {/* <-- 2. Add the new route */}
                    <Route path="/cart" element={<Cart />} />

                    {/* Protected Seller Route */}
                    <Route 
                        path="/seller" 
                        element={
                            <ProtectedRoute>
                                <Seller />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;