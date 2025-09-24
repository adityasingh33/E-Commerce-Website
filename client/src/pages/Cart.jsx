import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Make sure this path is correct
import cartService from '../feature/CartService'; // Import the service you just created

// --- SVG Icon Components ---
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching Function ---
    const fetchCart = async () => {
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch (err) {
            console.error(err);
            // If cart not found (404), treat it as an empty cart
            if (err.response && err.response.status === 404) {
                 setCart({ items: [] }); // Set an empty cart object
            } else {
                setError('Failed to load your cart. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []); // Fetch cart on initial component mount

    // --- Handler Functions ---
    const handleUpdateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            await cartService.updateCartItem(productId, quantity);
            fetchCart(); // Refetch the cart to show updated state
        } catch (err) {
            console.error('Failed to update quantity:', err);
            alert('Could not update item quantity.');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            fetchCart(); // Refetch the cart
        } catch (err) {
            console.error('Failed to remove item:', err);
            alert('Could not remove item from cart.');
        }
    };

    const handleClearCart = async () => {
        try {
            await cartService.clearCart();
            fetchCart(); // Refetch the cart
        } catch (err) {
            console.error('Failed to clear cart:', err);
            alert('Could not clear the cart.');
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="text-center py-10">Loading Your Cart...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center bg-white p-12 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty.</h2>
                        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
                        <Link 
                            to="/" 
                            className="mt-6 inline-block bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
                        <ul role="list" className="divide-y divide-gray-200">
                            {cart.items.map((item) => (
                                <li key={item.product._id} className="p-4 sm:p-6 flex space-x-4">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 rounded-md object-cover"/>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                                            <p className="text-md font-bold text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                                                <span className="px-3 py-1 text-center">{item.quantity}</span>
                                                <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
                                            </div>
                                            <button onClick={() => handleRemoveItem(item.product._id)} className="text-red-500 hover:text-red-700">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Order Summary</h2>
                        <div className="space-y-4 mt-4">
                            <div className="flex justify-between">
                                <p className="text-gray-600">Subtotal</p>
                                <p className="font-medium">${cart.totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Shipping</p>
                                <p className="font-medium">{cart.totalAmount > 100 ? 'Free' : '$10.00'}</p>
                            </div>
                            <div className="border-t pt-4 flex justify-between items-center">
                                <p className="text-lg font-bold text-gray-900">Total</p>
                                <p className="text-lg font-bold text-gray-900">${(cart.totalAmount + (cart.totalAmount > 100 ? 0 : 10)).toFixed(2)}</p>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                            Proceed to Checkout
                        </button>
                        <button onClick={handleClearCart} className="w-full mt-2 text-sm text-red-500 hover:text-red-700">
                            Clear Cart
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Cart;