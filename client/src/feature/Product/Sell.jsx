import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/products/';
const API_URL = `${import.meta.env.VITE_API_URL}/api/products/`;

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

// GET products for the logged-in seller
const getSellerProducts = async () => {
    try {
        const response = await axios.get(API_URL + 'myproducts', getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching seller products:', error);
        throw error;
    }
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

// POST a new product
const addProduct = async (productData) => {
    try {
        // Validate required fields
        const { name, price, description, imageUrl, stock, category } = productData;
        
        if (!name || !price || !description || !imageUrl || !stock || !category) {
            throw new Error('All fields are required');
        }

        // Ensure numeric fields are properly formatted
        const formattedData = {
            ...productData,
            price: parseFloat(price),
            stock: parseInt(stock)
        };

        const response = await axios.post(API_URL + 'seller', formattedData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

// PUT (update) an existing product
const editProduct = async (productId, productData) => {
    try {
        if (!productId) {
            throw new Error('Product ID is required');
        }

        // Ensure numeric fields are properly formatted
        const formattedData = {
            ...productData,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock)
        };

        const response = await axios.put(API_URL + productId, formattedData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error editing product:', error);
        throw error;
    }
};

// DELETE a product
const deleteProduct = async (productId) => {
    try {
        if (!productId) {
            throw new Error('Product ID is required');
        }

        const response = await axios.delete(API_URL + productId, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

const productService = {
    getProducts,
    getProduct,
    getSellerProducts,
    addProduct,
    editProduct,
    deleteProduct
};

export default productService;