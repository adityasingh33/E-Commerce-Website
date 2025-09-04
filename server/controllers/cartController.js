import Cart from '../models/cartSchema.js'

export const getCart = async(req,res) => {
    try{
      const cart = await Cart.find({ user : req.user.id})
      res.status(200).json(cart);
    }catch(error){
      res.status(500).json({message : error.message});
    }
}

export const addCart = async(req,res) => {
    try{
       const [user ,items ,totalAmount] = req.body;

       if(!user || !items || !totalAmount){
          return res.status(400).json({message :" All of the are  needed"});
       }

       const cart = await Cart.create({
        user,
        items,
        totalAmount
       });

       if(cart) {
        res.status(201).json({
            _id : product._id,
            user:cart.user,
            totalAmount:cart.totalAmount
        })
       }else {
        res.status(400).json({message : 'Failed to add to cart'})
       }
    }catch(error){
        res.status(500).json({message : error.message});
    }
}

export const removeCart = async(req,res) => {
    try{
        const {id} = req.params;
        const cart = await Cart.findByIdAndDelete(id);

        if(!cart){
            return res.status(404).json({message : 'Product not found'});
        }

        res.status(200).json({message : err.message});
    }catch(err) {
        res.status(500).json({message : err.message});
    }
}