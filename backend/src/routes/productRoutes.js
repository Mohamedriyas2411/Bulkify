const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');
const authBuyer = require('../middleware/authBuyer');

router.post('/add', auth, productController.addProduct);
router.get('/myproducts',auth, productController.getMyProducts);
router.put('/update/:id',auth,productController.updateProduct);
router.delete('/delete/:id',auth, productController.deleteProduct);
router.get('/nearby', authBuyer, productController.getNearbyProducts);


// Wishlist routes
router.get('/wishlist', authBuyer, productController.getWishlist);
router.post('/wishlist/add', authBuyer, productController.addToWishlist);
router.post('/wishlist/remove', authBuyer, productController.removeFromWishlist);

router.get('/:id', authBuyer, productController.getProductById);


module.exports =router;