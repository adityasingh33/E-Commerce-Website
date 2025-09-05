import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get('/',(req,res) => {
    res.json({message : "api is running"})
});

app.use('/api/users',userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart/',cartRoutes);
app.use('/api/checkout/',checkoutRoutes);

const PORT  = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server is running on PORT ${PORT}`));