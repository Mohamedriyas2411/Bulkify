const express = require('express');
const router = express.Router();
const authBuyer = require('../middleware/authBuyer');
const cartController = require('../controllers/cartController');

router.post('/add', authBuyer, cartController.addToCart);
router.get('/', authBuyer, cartController.getCart);
router.delete('/remove/:itemId', authBuyer, cartController.removeFromCart);

module.exports = router;