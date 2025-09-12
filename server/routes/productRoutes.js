import express from "express"
import { getSellerProducts,getAllProducts,createProduct,deleteProduct,updateProduct,getProduct} from "../controllers/productController.js"
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();


router.post('/seller', protect, createProduct);

router.get('/myproducts', protect, getSellerProducts);

router.get('/',  getAllProducts);

router.get('/:id', getProduct);

router.put('/:id', protect, updateProduct);

router.delete('/:id', protect, deleteProduct);

export default router;