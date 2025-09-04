import express from "express"
import { getAllProducts,createProduct,deleteProduct,updateProduct,getProduct} from "../controllers/productController.js"
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();


router.post('/seller', protect, createProduct);

router.get('/',  getAllProducts);

router.get('/:id', getProduct);

router.put('/:id', protect, updateProduct);

router.delete('/:id', protect, deleteProduct);

export default router;