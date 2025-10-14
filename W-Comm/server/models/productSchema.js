import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxLength: [100, 'Product name cannot exceed 100 characters']
        },
        
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },
        
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            maxLength: [1000, 'Description cannot exceed 1000 characters']
        },
        
        imageUrl: {
            type: String,
            required: [true, 'Product image is required']
        },
        
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Seller is required']
        },
        
        stock: {
            type: Number,
            default: 0,
            min: [0, 'Stock cannot be negative']
        },
        
        category: {
            type: String,
            trim: true,
            required:[true,'Product category is required']
        },
        
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields automatically
    }
);

// Add indexes for better query performance
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' }); // For text search

export default mongoose.model('Product', productSchema);