const Product = require('../models/Product');

exports.addProduct = async (req, res)=>{
    try{
        const {name, quantity, price, minQuantity, discount,  image, category, description}=req.body;

        const newProduct = new Product({
            seller: req.seller.id,
            name,
            quantity,
            price,
            minQuantity,
            discount,
            image,
            category,
            description
        });

        const product = await newProduct.save();
        res.json(product);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMyProducts = async (req,res) =>{
    try{
        const products = await Product.find({seller: req.seller.id});
        res.json(products);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProduct = async(req,res)=>{
    try{
        const{name,quantity,price,minQuantity,discount,image, category, description} =req.body;
        let product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({msg:'Product not found'});

        if (product.seller.toString() !==req.seller.id){
            return res.status(401).json({msg:'Not authorized'});
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            {$set:{name, quantity,price,minQuantity, discount,image, category, description}},
            {new:true}
        );
        res.json(product);
    }catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteProduct = async (req,res) => {
    try{
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({msg:'Product not found'});

        if(product.seller.toString() !== req.seller.id){
            return res.status(401).json({msg:'Not authorized'});
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({msg:'Product removed'});

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

