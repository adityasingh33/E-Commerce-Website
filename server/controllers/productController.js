import Product from '../models/productSchema.js'

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, imageUrl, seller } = req.body;

        if (!name || !price || !description || !imageUrl || !seller) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = await Product.create({
            name,
            price,
            description,
            imageUrl,
            seller
        });

        if(product) {
            res.status(201).json({ 
                _id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.imageUrl,
                seller: product.seller
            });
        } else {
            res.status(400).json({ message: 'Failed to create product' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

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
}


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const product = await Product.findByIdAndDelete(id); 
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({ message: "Product deleted successfully" }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateData = req.body; 
        
        const product = await Product.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true } 
        ).populate('seller', 'name email');
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({ 
            message: "Product updated successfully",
            product: product
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}