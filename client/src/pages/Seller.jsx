import React, { useState, useEffect } from 'react';
import productService from '../feature/Product/Sell'; // Correct the import path if needed

const Seller = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentProductId, setCurrentProductId] = useState(null);

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

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsFetching(true);
        try {
            const data = await productService.getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
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

    const handleOpenModal = (mode, product = null) => {
        setIsModalOpen(true);
        setModalMode(mode);
        setError(null); // Clear previous errors when opening modal
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
        } else {
            setFormData(initialFormState);
            setCurrentProductId(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormState);
        setError(null);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(productId);
                fetchProducts(); // Refresh list after deleting
            } catch (err) {
                setError('Failed to delete product.');
                console.error(err);
            }
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (modalMode === 'add') {
                await productService.addProduct(formData);
            } else {
                await productService.editProduct(currentProductId, formData);
            }
            handleCloseModal();
            fetchProducts(); // Refresh list after add/edit
        } catch (err) {
            const message = err.response?.data?.message || `Failed to ${modalMode} product.`;
            setError(message);
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <button
                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors"
                        onClick={() => handleOpenModal('add')}
                    >
                        Add New Product
                    </button>
                </header>
                
                {isFetching && <p className="text-center text-gray-500">Loading products...</p>}
                
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
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.name} />
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
                                        <button onClick={() => handleOpenModal('edit', product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                            <header className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">{modalMode === 'add' ? 'Add Product' : 'Edit Product'}</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                            </header>
                            <form onSubmit={onSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Product Name</label>
                                        <input type="text" id="name" name="name" value={name} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                                        <input type="text" id="category" name="category" value={category} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">Price</label>
                                            <input type="number" id="price" name="price" value={price} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                                        </div>
                                        <div>
                                            <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-700">Stock</label>
                                            <input type="number" id="stock" name="stock" value={stock} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="imageUrl" className="block mb-2 text-sm font-medium text-gray-700">Image URL</label>
                                        <input type="text" id="imageUrl" name="imageUrl" value={imageUrl} onChange={onChange} placeholder="https://example.com/image.png" className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                                        <textarea id="description" name="description" value={description} onChange={onChange} rows="3" className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
                                    </div>
                                </div>
                                {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                                <footer className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
                                    <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save'}
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