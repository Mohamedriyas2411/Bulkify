const Product = require('../models/Product');
const Seller = require('../models/Seller');
const Buyer = require('../models/Buyer');

// Helper: Haversine Formula to calculate distance in KM
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

exports.getNearbyProducts = async (req, res) => {
  try {
    // 1. Get current Buyer's location
    const buyer = await Buyer.findById(req.buyer.id);
    if (!buyer) return res.status(404).json({ msg: 'Buyer not found' });

    const buyerLat = parseFloat(buyer.location.latitude);
    const buyerLon = parseFloat(buyer.location.longitude);

    // 2. Get All Sellers
    const allSellers = await Seller.find({});

    // 3. Filter Sellers within 5km radius
    const nearbySellerIds = allSellers.filter(seller => {
      const sellerLat = parseFloat(seller.location.latitude);
      const sellerLon = parseFloat(seller.location.longitude);
      
      const distance = getDistanceFromLatLonInKm(buyerLat, buyerLon, sellerLat, sellerLon);
      return distance <= 5; // Threshold: 5 KM
    }).map(seller => seller._id);

    // 4. Find Products belonging to these nearby sellers
    // We also populate the seller details if you want to show shop name
    const products = await Product.find({ seller: { $in: nearbySellerIds } })
                                  .populate('seller', 'shopName');

    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'shopName location');
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
        res.status(500).send('Server Error');    }
};
