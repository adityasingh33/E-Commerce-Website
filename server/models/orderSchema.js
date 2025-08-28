import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Enter your name']
        },

        price: {
            type: Number,
            required: [true, 'Enter the price for the product']
        },

        description: {
            type: String,
            required: [true, "Enter the description"]
        },

        imageUrl: {
            type: String,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        ///include stock later 
    }
)

export default mongoose.model('Product', productSchema);