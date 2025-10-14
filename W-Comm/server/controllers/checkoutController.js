import Checkout from "../models/checkoutSchema.js"; 

export const createOrder = async(req, res) => {
    try {
        
        const { phone, address, items, totalAmount } = req.body; 
        
        const userId = req.user.id;

     
        if (!userId || !phone || !address || !items || !totalAmount) {
            return res.status(400).json({ message: "All the details are required" });
        }

        
        const order = await Checkout.create({ 
            user: userId,
            phone,
            address,
            items,
            totalAmount,
        });

        if (order) {
            res.status(201).json({
               
                _id: order._id,           
                user: order.user,        
                address: order.address,   
                phone: order.phone,     
                items: order.items,       
                totalAmount: order.totalAmount, 
                orderStatus: order.orderStatus, 
                createdAt: order.createdAt      
            });
        } else {
            res.status(400).json({ message: 'Failed to create the order' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserOrders = async (req, res) => {
    try {
       
        const orders = await Checkout.find({ user: req.user.id })
            .populate('items.product', 'name price imageUrl') 
            .sort({ createdAt: -1 }); 

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({
            count: orders.length,
            orders: orders        
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Checkout.findById(orderId)
            .populate('user', 'name email')          
            .populate('items.product', 'name price imageUrl'); 
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        if (order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;
        
   
        const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        
        const order = await Checkout.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true } 
        );
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json({
            message: "Order status updated successfully",
            order: order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}