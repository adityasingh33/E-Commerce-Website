// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/cart/'; // Adjust if your cart route is different

// // Helper function to get the auth token from localStorage
// const getAuthHeaders = () => {
//     try {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (user && user.token) {
//             return {
//                 headers: {
//                     Authorization: `Bearer ${user.token}`,
//                 }
//             };
//         }
//     } catch (error) {
//         console.error('Could not parse user from localStorage', error);
//     }
//     return {};
// };

// // GET the user's cart
// const getCart = async () => {
//     const response = await axios.get(API_URL, getAuthHeaders());
//     return response.data;
// };

// // POST to add an item to the cart
// const addToCart = async (productData) => {
//     // Expects { productId, quantity, price }
//     const response = await axios.post(API_URL, productData, getAuthHeaders());
//     return response.data;
// };

// // PUT to update an item's quantity
// const updateCartItem = async (productId, quantity) => {
//     const response = await axios.put(API_URL + productId, { quantity }, getAuthHeaders());
//     return response.data;
// };

// // DELETE an item from the cart
// const removeFromCart = async (productId) => {
//     const response = await axios.delete(API_URL + productId, getAuthHeaders());
//     return response.data;
// };

// // DELETE all items from the cart
// const clearCart = async () => {
//     const response = await axios.delete(API_URL, getAuthHeaders());
//     return response.data;
// };

// const cartService = {
//     getCart,
//     addToCart,
//     updateCartItem,
//     removeFromCart,
//     clearCart,
// };

// export default cartService;

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/cart/`;

// Helper function to get the auth token from localStorage
const getAuthHeaders = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            return {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
        }
    } catch (error) {
        console.error('Could not parse user from localStorage', error);
    }
    return {};
};

// GET the user's cart
const getCart = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

// POST to add an item to the cart
const addToCart = async (productData) => {
    // Expects { productId, quantity, price }
    const response = await axios.post(API_URL, productData, getAuthHeaders());
    return response.data;
};

// PUT to update an item's quantity
const updateCartItem = async (productId, quantity) => {
    const response = await axios.put(API_URL + productId, { quantity }, getAuthHeaders());
    return response.data;
};

// DELETE an item from the cart
const removeFromCart = async (productId) => {
    const response = await axios.delete(API_URL + productId, getAuthHeaders());
    return response.data;
};

// DELETE all items from the cart
const clearCart = async () => {
    const response = await axios.delete(API_URL, getAuthHeaders());
    return response.data;
};

const cartService = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};

export default cartService;