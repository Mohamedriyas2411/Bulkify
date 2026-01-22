const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const buyerController = require('../controllers/buyerController');

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number must be exactly 10 digits')
        .isNumeric()
        .isLength({ min: 10, max: 10 }),
        check('password', 'Password must be 6-16 characters long and include at least one number and one special character')
        .isLength({ min: 6, max: 16 })
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
        check('location.latitude', 'Latitude is required').not().isEmpty(),
        check('location.longitude', 'Longitude is required').not().isEmpty()
    ],
    buyerController.registerBuyer
);

router.post(
    '/login',
    [check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    ],
    buyerController.loginBuyer
);  

module.exports = router;