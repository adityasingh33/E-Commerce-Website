import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products/';

// Helper function to get the auth token
const getAuthHeaders = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            return {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            };
        }
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
    }
    return {
        headers: {
            'Content-Type': 'application/json'
        }
    };
};


// GET all products (public)
const getProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
};

// GET single product by ID
const getProduct = async (productId) => {
    try {
        const response = await axios.get(API_URL + productId);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};




const productService = {
    getProducts,
    getProduct,
};

export default productService;