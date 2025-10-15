import axios from 'axios';

// Adjust the base URL to your actual API endpoint for orders/checkout
// const API_URL = 'http://localhost:5000/api/checkout/';

const API_URL = `${import.meta.env.VITE_API_URL}/api/cart/checkout/`;

// Helper function to get the authentication token from localStorage
const getAuthHeaders = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            return {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    // Explicitly set Content-Type for POST/PUT requests
                    'Content-Type': 'application/json',
                }
            };
        }
    } catch (error) {
        console.error('Could not parse user from localStorage', error);
    }
    // Return a default header if no user/token is found
    return { headers: { 'Content-Type': 'application/json' } };
};

/**
 * Creates a new order.
 * @param {object} orderData - The order data (phone, address, items, totalAmount).
 */
const createOrder = async (orderData) => {
    const response = await axios.post(API_URL, orderData, getAuthHeaders());
    return response.data;
};

/**
 * Fetches all orders for the currently logged-in user.
 */
const getUserOrders = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

/**
 * Fetches a single order by its ID.
 * @param {string} orderId - The ID of the order to fetch.
 */
const getOrderById = async (orderId) => {
    const response = await axios.get(`${API_URL}${orderId}`, getAuthHeaders());
    return response.data;
};

// Note: The updateOrderStatus function is typically used in an admin dashboard,
// but it is included here for completeness.
/**
 * Updates the status of an existing order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} orderStatus - The new status of the order.
 */
const updateOrderStatus = async (orderId, orderStatus) => {
    const response = await axios.put(`${API_URL}${orderId}`, { orderStatus }, getAuthHeaders());
    return response.data;
};


const checkoutService = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};

export default checkoutService;

