import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import cartService from '../feature/CartService.jsx';
import checkoutService from '../feature/CheckoutServices.jsx';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        phone: '',
        address: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const cartData = await cartService.getCart();
                setCart(cartData);
            } catch (err) {
                console.error('Failed to fetch cart:', err);
                setError('Could not load your cart for checkout.');
            } finally {
                setLoading(false);
            }
        };
        fetchCartData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.phone || !formData.address) {
            setError('Phone number and address are required.');
            return;
        }
        if (!cart || cart.items.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        const orderData = {
            ...formData,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: cart.totalAmount,
        };

        try {
            const createdOrder = await checkoutService.createOrder(orderData);
            // After creating the order, clear the cart
            await cartService.clearCart();
            // Redirect to a success page or user's order history
            alert('Order placed successfully!');
            navigate('/orders'); // You might need to create an orders page
        } catch (err) {
            console.error('Failed to create order:', err);
            setError('There was a problem placing your order. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading Checkout...</div>;
    }
    
    return (
        <div className="bg-gray-100 min-h-screen">
       
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
                
                {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shipping Details Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Shipping Information</h2>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
                                <textarea 
                                    id="address" 
                                    name="address"
                                    rows="4"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="123 Main St, Anytown, USA 12345"
                                    required
                                ></textarea>
                            </div>
                             <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                                Place Order
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Your Order</h2>
                        {!cart || cart.items.length === 0 ? (
                             <p className="mt-6 text-gray-500">Your cart is empty.</p>
                        ) : (
                            <>
                                <ul className="mt-6 divide-y divide-gray-200">
                                    {cart.items.map(item => (
                                        <li key={item.product._id} className="py-4 flex items-center space-x-4">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-800">{item.product.name}</h3>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t mt-4 pt-4 space-y-2">
                                     <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${cart.totalAmount.toFixed(2)}</span>
                                     </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;

