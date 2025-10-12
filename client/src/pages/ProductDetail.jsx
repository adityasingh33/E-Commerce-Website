
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar.jsx';
import productService from '../feature/Product/Buy.jsx';
import cartService from '../feature/CartService.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProduct(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Could not find this product.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    try {
      const cartData = {
        productId: product._id,
        quantity: quantity,
        price: product.price
      };
      await cartService.addToCart(cartData);
      // navigate('/cart');
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("There was an error adding the product to your cart.");
    }
  };

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
    
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            <div className="aspect-[4/3] bg-gray-200">
              <img
                src={product.imageUrl || 'https://placehold.co/600x450/e2e8f0/334155?text=Product'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

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
                <p className="text-4xl font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</p>
                
                <div className="mt-6 flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => handleQuantityChange(-1)} className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}>-</button>
                        <span className="px-5 py-2 text-lg text-center font-semibold">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={quantity >= product.stock}>+</button>
                    </div>

                    <button 
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;