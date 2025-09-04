import express from 'express'
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../controllers/cartControllers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.get('/cart', protect, getCart);

router.post('/cart', protect, addToCart);

router.delete('/cart/:productId', protect, removeFromCart);

router.put('/cart/:productId', protect, updateCartItem);

router.delete('/cart', protect, clearCart);

export default router;