import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products/';

// Helper function to get the auth token from wherever you store it (e.g., localStorage)
const getAuthHeaders = () => {
    // Assuming you store the token in localStorage after login
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };
    }
    return {};
};

// GET all products
const getProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// POST a new product
const addProduct = async (productData) => {
    // The endpoint is '/seller' for creation as per your routes
    const response = await axios.post(API_URL + 'seller', productData, getAuthHeaders());
    return response.data;
};

// PUT (update) an existing product
const editProduct = async (productId, productData) => {
    // Correct URL format: /api/products/:id
    const response = await axios.put(API_URL + productId, productData, getAuthHeaders());
    return response.data;
};

// DELETE a product
const deleteProduct = async (productId) => {
    // Correct URL format: /api/products/:id
    const response = await axios.delete(API_URL + productId, getAuthHeaders());
    return response.data;
};

const productService = {
    getProducts,
    addProduct,
    editProduct,
    deleteProduct
};

export default productService;