import React, { useState, useEffect } from 'react';
import productService from '../feature/Product/Sell';

const Seller = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentProductId, setCurrentProductId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const initialFormState = {
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        stock: '',
        category: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const { name, price, description, imageUrl, stock, category } = formData;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsFetching(true);
        try {
            const data = await productService.getSellerProducts(); 
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch your products. Please try again later.');
            console.error(err);
        }
        setIsFetching(false);
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        
        // Create preview URL
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(null);
        }
    };

    const handleOpenModal = (mode, product = null) => {
        setIsModalOpen(true);
        setModalMode(mode);
        setError(null);
        setImageFile(null);
        setImagePreview(null);
        
        if (mode === 'edit' && product) {
            setFormData({
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl,
                stock: product.stock,
                category: product.category
            });
            setCurrentProductId(product._id);
            // Set preview to existing image for edit mode
            setImagePreview(product.imageUrl);
        } else {
            setFormData(initialFormState);
            setCurrentProductId(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormState);
        setError(null);
        setImageFile(null);
        setImagePreview(null);
        
        // Clean up preview URL to prevent memory leaks
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(productId);
                fetchProducts();
            } catch (err) {
                setError('Failed to delete product.');
                console.error(err);
            }
        }
    };

    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'Seller'); 

        const cloudName =  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const api_url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const response = await fetch(api_url, {
            method: 'POST',
            body: data
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.secure_url) {
            throw new Error(result.error?.message || 'Image upload failed');
        }
        
        return result.secure_url;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: For new products, require an image
        if (modalMode === 'add' && !imageFile) {
            setError('Please select an image for the new product.');
            return;
        }

        setLoading(true);
        setError(null);

        let finalImageUrl = formData.imageUrl; // Keep existing URL for edits

        try {
            // Upload to Cloudinary if a new image is selected
            if (imageFile) {
                finalImageUrl = await uploadToCloudinary(imageFile);
            }

            // Prepare product data with the final image URL
            const productData = { 
                ...formData,
                imageUrl: finalImageUrl 
            };

            // Submit to your backend
            if (modalMode === 'add') {
                await productService.addProduct(productData);
            } else {
                await productService.editProduct(currentProductId, productData);
            }

            handleCloseModal();
            fetchProducts();

        } catch (err) {
            const message = err.response?.data?.message || err.message || `Failed to ${modalMode} product.`;
            setError(message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                    <button
                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors"
                        onClick={() => handleOpenModal('add')}
                    >
                        Add New Product
                    </button>
                </header>
                
                {isFetching && <p className="text-center text-gray-500">Loading products...</p>}
                
                {error && !isModalOpen && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}
                
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length === 0 && !isFetching ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No products found. Add your first product!
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img 
                                                        className="h-10 w-10 rounded-md object-cover" 
                                                        src={product.imageUrl} 
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleOpenModal('edit', product)} 
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product._id)} 
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <header className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    {modalMode === 'add' ? 'Add Product' : 'Edit Product'}
                                </h2>
                                <button 
                                    onClick={handleCloseModal} 
                                    className="text-gray-500 hover:text-gray-800 text-2xl"
                                >
                                    ×
                                </button>
                            </header>
                            
                            <form onSubmit={onSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                            Product Name *
                                        </label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            value={name} 
                                            onChange={onChange} 
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
                                            Category *
                                        </label>
                                        <input 
                                            type="text" 
                                            id="category" 
                                            name="category" 
                                            value={category} 
                                            onChange={onChange} 
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">
                                                Price ($) *
                                            </label>
                                            <input 
                                                type="number" 
                                                id="price" 
                                                name="price" 
                                                value={price} 
                                                onChange={onChange} 
                                                step="0.01"
                                                min="0"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-700">
                                                Stock *
                                            </label>
                                            <input 
                                                type="number" 
                                                id="stock" 
                                                name="stock" 
                                                value={stock} 
                                                onChange={onChange} 
                                                min="0"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">
                                            Product Image {modalMode === 'add' && '*'}
                                        </label>
                                        <input 
                                            type="file" 
                                            id="image" 
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            {modalMode === 'add' ? 'Please select an image for your product.' : 'Select a new image to replace the current one.'}
                                        </p>
                                        
                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <div className="mt-3">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="h-24 w-24 object-cover rounded-md border border-gray-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                                            Description *
                                        </label>
                                        <textarea 
                                            id="description" 
                                            name="description" 
                                            value={description} 
                                            onChange={onChange} 
                                            rows="3" 
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                                            required
                                        />
                                    </div>
                                </div>
                                
                                {error && (
                                    <div className="mt-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md">
                                        {error}
                                    </div>
                                )}
                                
                                <footer className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
                                    <button 
                                        type="button" 
                                        onClick={handleCloseModal} 
                                        className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors" 
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : modalMode === 'add' ? 'Add Product' : 'Update Product'}
                                    </button>
                                </footer>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Seller;