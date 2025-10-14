// import React from 'react';

// const ProductCard = ({ product }) => {
//   // Destructure for easier access and provide default values
//   const { name = 'No Name', price = 0, description = 'No description available.', imageUrl } = product;

//   return (
//     // The entire card container
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-transform duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      
//       {/* Product Image Container */}
//       <div className="relative">
//         <div className="w-full aspect-[4/3] bg-gray-200">
//             <img 
//                 src={imageUrl || 'https://via.placeholder.com/400x300'} 
//                 alt={name} 
//                 className="w-full h-full object-cover"
//             />
//         </div>
//         {/* Optional: Add an overlay or a quick-add button that appears on hover */}
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <button className="text-white text-lg bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
//                 Quick View
//             </button>
//         </div>
//       </div>
      
//       {/* Product Information Section */}
//       <div className="p-4 flex flex-col flex-grow">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate" title={name}>
//           {name}
//         </h3>

//         <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3">
//           {description}
//         </p>

//         {/* Price and Add to Cart Button */}
//         <div className="mt-auto flex justify-between items-center">
//           <p className="text-xl font-bold text-gray-900">${price.toFixed(2)}</p>
//           <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;



import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Destructure for easier access and provide default values
  const { _id, name = 'No Name', price = 0, description = 'No description available.', imageUrl } = product;

  // Stop propagation on button clicks to prevent navigating
  const handleButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault(); // Also prevent the link's default behavior
    alert(`"${name}" added to cart!`); // Placeholder action
  };

  return (
    // Link to the specific product's detail page
    <Link to={`/product/${_id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-transform duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 h-full">
        
        {/* Product Image Container */}
        <div className="relative">
          <div className="w-full aspect-[4/3] bg-gray-200">
              <img 
                  src={imageUrl || 'https://placehold.co/400x300/e2e8f0/334155?text=Product'} 
                  alt={name} 
                  className="w-full h-full object-cover"
              />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handleButtonClick} 
                className="text-white text-lg bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                  Quick View
              </button>
          </div>
        </div>
        
        {/* Product Information Section */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate" title={name}>
            {name}
          </h3>

          <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3">
            {description}
          </p>

          {/* Price and Add to Cart Button */}
          <div className="mt-auto flex justify-between items-center">
            <p className="text-xl font-bold text-gray-900">${price.toFixed(2)}</p>
            <button 
              onClick={handleButtonClick}
              className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;