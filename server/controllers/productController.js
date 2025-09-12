// import Product from '../models/productSchema.js'

// export const createProduct = async (req, res) => {
//     try {
//         const { name, price, description, imageUrl, seller,stock,category } = req.body;

//         if (!name || !price || !description || !imageUrl || !seller || !stock || !category) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const product = await Product.create({
//             name,
//             price,
//             description,
//             imageUrl,
//             seller,
//             stock,
//             category
//         });

//         if(product) {
//             res.status(201).json({ 
//                 _id: product._id,
//                 name: product.name,
//                 price: product.price,
//                 description: product.description,
//                 imageUrl: product.imageUrl,
//                 seller: product.seller,
//                 stock:product.stock,
//                 category:product.category
//             });
//         } else {
//             res.status(400).json({ message: 'Failed to create product' });
//         }
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// export const getSellerProducts = async (req, res) => {
//     try {
//         // Find products where the seller field matches the logged-in user's ID
//         // req.user.id comes from your 'protect' middleware
//         const products = await Product.find({ seller: req.user.id });
//         res.status(200).json(products);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// export const getProduct = async (req, res) => {
//     try {
//         const { id } = req.params; 
//         const product = await Product.findById(id).populate('seller', 'name email'); 
        
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
        
//         res.status(200).json(product);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }


// export const getAllProducts = async (req, res) => {
//     try {
//         const products = await Product.find().populate('seller', 'name email');
//         res.status(200).json(products);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }


// export const deleteProduct = async (req, res) => {
//     try {
//         const { id } = req.params; 
//         const product = await Product.findByIdAndDelete(id); 
        
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         //new check
//         if (product.seller.toString() !== req.user.id) {
//             return res.status(401).json({ message: 'User not authorized' });
//         }
//         //new check
//         await Product.findByIdAndDelete(req.params.id);
//         res.status(200).json({ message: "Product deleted successfully" }); 
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// export const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params; 
//         const updateData = req.body; 
        
//         const product = await Product.findByIdAndUpdate(
//             id, 
//             updateData, 
//             { new: true, runValidators: true } 
//         ).populate('seller', 'name email');
        
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
        
//         res.status(200).json({ 
//             message: "Product updated successfully",
//             product: product
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message }); 
//     }
// }

import Product from '../models/productSchema.js';

// /**
//  * @desc    Create a new product
//  * @route   POST /api/products/seller
//  * @access  Private (Sellers only)
//  */
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, imageUrl, stock, category } = req.body;
        
        // The 'seller' is the logged-in user, taken from the authentication middleware.
        // This is a crucial security step to prevent users from creating products for others.
        const seller = req.user.id;

        if (!name || !price || !description || !imageUrl || !stock || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = await Product.create({
            name,
            price,
            description,
            imageUrl,
            seller, // Use the secure seller ID from the token
            stock,
            category
        });
        
        res.status(201).json(product);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// /**
//  * @desc    Get all products for the logged-in seller
//  * @route   GET /api/products/myproducts
//  * @access  Private (Sellers only)
//  */
export const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// /**
//  * @desc    Get a single product by ID
//  * @route   GET /api/products/:id
//  * @access  Public
//  */
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const product = await Product.findById(id).populate('seller', 'name email'); 
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// /**
//  * @desc    Get all products for public viewing
//  * @route   GET /api/products
//  * @access  Public
//  */
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// /**
//  * @desc    Delete a product
//  * @route   DELETE /api/products/:id
//  * @access  Private (Owner only)
//  */
export const deleteProduct = async (req, res) => {
    try {
        // First, find the product to check ownership
        const product = await Product.findById(req.params.id); 
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Security Check: Ensure the logged-in user is the owner of the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        // If the check passes, delete the product
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Product deleted successfully" }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// /**
//  * @desc    Update a product
//  * @route   PUT /api/products/:id
//  * @access  Private (Owner only)
//  */
export const updateProduct = async (req, res) => {
    try {
        // First, find the product to check ownership
        const product = await Product.findById(req.params.id); 
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Security Check: Ensure the logged-in user is the owner of the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // If the check passes, update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        ).populate('seller', 'name email');
        
        res.status(200).json({ 
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
};