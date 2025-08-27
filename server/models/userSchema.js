import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Enter you name']
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Enter the Email"]
        },
        password: {
            type: String,
            required: [true],
        },
        sellerInfo: {
            shopName: { type: String },
            gstNumber: { type: String },
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User',userSchema);