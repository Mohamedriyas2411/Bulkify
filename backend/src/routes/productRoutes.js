const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');

router.post('/add', auth, productController.addProduct);
router.get('/myproducts',auth, productController.getMyProducts);
router.put('/update/:id',auth,productController.updateProduct);
router.delete('/delete/:id',auth, productController.deleteProduct);

module.exports =router;