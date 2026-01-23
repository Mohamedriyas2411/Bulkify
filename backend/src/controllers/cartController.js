const Cart= require('../models/Cart');
const Product= require('../models/Product');

exports.addToCart = async (req, res) => {
    const {productId, quantity} = req.body;
    try{
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({msg: 'Product not found'});
        }
        let cartItem = await Cart.findOne({buyer: req.buyer.id, product: productId});
        if(cartItem){
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = new Cart({
                buyer: req.buyer.id,
                product: productId,
                quantity
            });
            await cartItem.save();
        }
        res.json(cartItem);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCart = async (req, res) => {
    try{
        const cartItems = await Cart.find({buyer: req.buyer.id}).populate('product');
        res.json(cartItems);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};

exports.removeFromCart = async (req, res) => {
    try{
        const cartItem = await Cart.findByIdAndDelete({
            _id: req.params.itemId,
            buyer: req.buyer.id
        });
        if(!cartItem){
            return  res.status(404).json({msg: 'Cart item not found'});
        }
        res.json({msg: 'Item removed from cart'});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};