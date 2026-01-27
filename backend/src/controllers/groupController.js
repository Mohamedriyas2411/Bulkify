const ProductGroup = require('../models/ProductGroup');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Community = require('../models/Community');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPaymentOrder = async (req, res) => {
    try{
        const {amount} = req.body;

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: "receipt_" +Date.now()
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');


    }
};

exports.createGroup = async (req, res) => {
    try{
        const{
            name, productId, quantity, deadline,
            communityId, razorpay_payment_id, razorpay_order_id, razorpay_signature
        } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256',
            process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        // Debug log for signature verification
        console.log({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          expectedSignature
        });
        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({msg: 'Invalid payment signature'});
        }

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({msg: 'Product not found'});
        }
        const newGroup = new ProductGroup({
            name,
            product: productId,
            leader: req.buyer.id,
            community: communityId || null,
            targetQuantity: product.minQuantity,
            currentQuantity: parseInt(quantity),
            deadline: new Date(deadline),
            members: [{
                buyer: req.buyer.id,
                quantity: parseInt(quantity),
                paidAmount: product.price * parseInt(quantity),
                joinedAt: Date.now()
            }]
        });

        await newGroup.save();
        await Cart.findOneAndDelete({buyer: req.buyer.id, product: productId});
        res.json(newGroup);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');


    }
};

exports.joinGroup = async (req, res) => {
    try{
        const {quantity, razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;    
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256',
            process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        // Debug log for signature verification
        console.log({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          expectedSignature
        });
        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({msg: 'Invalid payment signature'});
        }

        const group = await ProductGroup.findById(req.params.id);
        if(!group){
            return res.status(404).json({msg: 'Product group not found'});
        }

        if(group.status !== 'open'){
            return res.status(400).json({msg: 'Cannot join a closed or expired group'});
        }
        group.members.push({
            buyer: req.buyer.id,
            quantity: parseInt(quantity),
            paidAmount: group.product.price * parseInt(quantity),
        });
        group.currentQuantity += parseInt(quantity);
        if(group.currentQuantity >= group.targetQuantity){
            group.status = 'completed';
        }
        await group.save();
        res.json(group);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getRecommendedGroups = async (req, res) => {
    try{
        const cartItems = await Cart.find({buyer: req.buyer.id});
        const cartProductIds = cartItems.map(item => item.product);
        const communties = await Community.find({ members: req.buyer.id });
        const communityIds = communties.map(c => c._id);

        const groups = await ProductGroup.find({
            status: 'open',
            $or: [
                { product: { $in: cartProductIds } },
                { community: { $in: communityIds } }
            ]
        }).populate('product').populate('community','name').populate('leader', 'name');
        res.json(groups);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMyGroups = async (req, res) => {
    try{
        const groups = await ProductGroup.find({
            'members.buyer': req.buyer.id
        }).populate('product').populate('community','name').populate('leader', 'name');
        res.json(groups);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};

