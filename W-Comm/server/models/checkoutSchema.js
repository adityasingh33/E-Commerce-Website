// import mongoose from "mongoose";

// const checkoutSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',  
//         required: true
    
//     },
    
 
//     address: {
//         street: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         city: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         state: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         zipCode: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         country: {
//             type: String,
//             required: true,
//             default: 'India',
//             trim: true
//         }
//     },
    
//     phone: {
//         type: Number,  
//         required: true,
//         validate: {
//             validator: function(v) {
          
//                 return /^\d{10}$/.test(v.toString());
//             },
//             message: 'Phone number must be 10 digits'
//         }
//     },
    

//     items: [{
//         product: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product',
//             required: true
//         },
//         quantity: {
//             type: Number,
//             required: true,
//             min: 1
//         },
//         price: {
//             type: Number,
//             required: true,
//             min: 0
//         }
//     }],
    
//     totalAmount: {
//         type: Number,
//         required: true,
//         min: 0
//     },
    
//     paymentMethod: {
//         type: String,
//         enum: ['Cash on Delivery', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
//         default: 'Cash on Delivery'
//     },
// }, {
//     timestamps: true  
// });


// checkoutSchema.pre('save', function(next) {
//     this.totalAmount = this.items.reduce((total, item) => {
//         return total + (item.price * item.quantity);
//     }, 0);
//     next();
// });

// checkoutSchema.index({ user: 1 });
// checkoutSchema.index({ orderStatus: 1 });
// checkoutSchema.index({ createdAt: -1 });

// export default mongoose.model('Checkout', checkoutSchema);





import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    
    address: {
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        zipCode: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            default: 'India',
            trim: true
        }
    },
    
    phone: {
        type: String,  // Changed to String to handle validation better
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Phone number must be 10 digits'
        }
    },
    
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    
    paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
        default: 'Cash on Delivery'
    },
    
    orderStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true  
});

// Pre-save hook to calculate total amount
checkoutSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    next();
});

// Indexes for better query performance
checkoutSchema.index({ user: 1 });
checkoutSchema.index({ orderStatus: 1 });
checkoutSchema.index({ createdAt: -1 });

export default mongoose.model('Checkout', checkoutSchema);