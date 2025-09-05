import express from "express"
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from "../controllers/checkoutController.js";
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post('/', protect, createOrder); 

router.get('/', protect, getUserOrders); 

router.get('/:orderId', protect, getOrderById);

router.put('/:orderId/status', protect, updateOrderStatus); 

export default router;