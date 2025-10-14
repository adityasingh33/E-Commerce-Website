import Cart from '../models/cartSchema.js'

export const getCart = async(req, res) => {
    try {
       
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        res.status(200).json(cart);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// export const addToCart = async(req, res) => {
//     try {
//         const { productId, quantity, price } = req.body;
//         const userId = req.user.id;

//         if (!productId || !quantity || !price) {
//             return res.status(400).json({ message: "Product ID, quantity, and price are required" });
//         }

      
//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
           
//             cart = new Cart({
//                 user: userId,
//                 items: [{ product: productId, quantity, price }]
//             });
//         } else {
           
//             const existingItemIndex = cart.items.findIndex(
//                 item => item.product.toString() === productId
//             );

//             if (existingItemIndex > -1) {
                
//                 cart.items[existingItemIndex].quantity += quantity;
//             } else {
               
//                 cart.items.push({ product: productId, quantity, price });
//             }
//         }

//         await cart.save();

//         res.status(201).json({
//             _id: cart._id,
//             user: cart.user,
//             items: cart.items,
//             totalAmount: cart.totalAmount
//         });

//     } catch(error) {
//         res.status(500).json({ message: error.message });
//     }
// }


import Product from '../models/productSchema.js'; // Add this import

export const addToCart = async(req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        // Fetch product from DB to get the correct price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const price = product.price;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity, price }]
            });
        } else {
            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += quantity;
                cart.items[existingItemIndex].price = price; // Always update price from DB
            } else {
                cart.items.push({ product: productId, quantity, price });
            }
        }

        await cart.save();

        res.status(201).json({
            _id: cart._id,
            user: cart.user,
            items: cart.items,
            totalAmount: cart.totalAmount
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}


export const removeFromCart = async(req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOne({user: userId});

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

       
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        
        await cart.save(); 

        res.status(200).json({ 
            message: 'Item removed from cart successfully',
            cart: cart
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCartItem = async(req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({
            message: 'Cart item updated successfully',
            cart: cart
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export const clearCart = async(req, res) => {
    try {
        const userId = req.user.id;
        
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ 
            message: 'Cart cleared successfully',
            cart: cart
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}