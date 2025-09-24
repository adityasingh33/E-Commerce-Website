import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import productService from '../feature/Product/Buy.jsx'; // Your product service

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Assumes your service has a 'getProduct' function that takes an ID
        const data = await productService.getProduct(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Could not find this product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]); // Re-run effect if the ID changes

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-10">Loading product...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center py-10 text-red-500">{error}</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="text-center py-10">Product not found.</div>
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* <Navbar /> */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Product Image */}
            <div className="aspect-[4/3] bg-gray-200">
              <img
                src={product.imageUrl || 'https://placehold.co/600x450/e2e8f0/334155?text=Product'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
                <p className="text-sm font-medium text-indigo-600 mt-2">Category: {product.category}</p>
                
                <p className="mt-6 text-base text-gray-700">{product.description}</p>
                
                <p className="mt-4">
                  <span className="font-semibold">Sold by: </span>{product.seller?.name || 'Unknown Seller'}
                </p>

                <p className={`mt-4 font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </p>
              </div>

              <div className="mt-8">
                <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                <button 
                  disabled={product.stock === 0}
                  className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;