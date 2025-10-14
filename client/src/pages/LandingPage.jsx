import React, { useState, useEffect } from 'react';
import productService from '../feature/Product/Buy';
import { Link } from 'react-router-dom'; // 1. Import the Link component

const LandingPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Could not load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* <Navbar /> I've uncommented your Navbar for a complete UI */}
            
            {/* Hero Section */}
            <header className="bg-indigo-100">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                        Discover Your Next Favorite Thing
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-indigo-800 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Browse our exclusive collection of high-quality products from the best sellers.
                    </p>
                </div>
            </header>

            {/* Product Display Section */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Featured Products</h2>
                
                {loading && <div className="text-center text-gray-500">Loading...</div>}
                {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}
                
                {!loading && !error && (
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                        {products.map((product) => (
                            // 2. Wrap the entire card in a Link. The key prop is moved here.
                            <Link to={`/product/${product._id}`} key={product._id} className="group">
                                <div className="relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full">
                                    <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-60">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-center object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/e2e8f0/334155?text=Image+Error'; }}
                                        />
                                    </div>
                                    <div className="flex-1 p-4 space-y-2 flex flex-col">
                                        {/* 3. The old <a> tag is removed from here */}
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 flex-grow">{product.description}</p>
                                        <div className="flex-1 flex flex-col justify-end">
                                             <p className="text-sm text-gray-500">Category: {product.category}</p>
                                            <p className="text-xl font-semibold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default LandingPage;