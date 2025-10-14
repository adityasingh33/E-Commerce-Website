import React, { useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import productService from '../feature/Product/Buy';

const Product = () => {
   const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  },[]);

  const fetchProducts = async() => {
    try{
         const data = await productService.getProducts();
         setProducts(data);
    }catch(error){
        setError('Failed to fetch your products. Please try again later.');
            console.error(err);
    }
  }

  
  return (
    <div>
      
    </div>
  )
}

export default Product
