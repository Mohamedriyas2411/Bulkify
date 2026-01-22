const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const deliveryController = require('../controllers/DeliveryController');

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
    deliveryController.registerDeliveryman
);
router.post(
    '/login',
    [check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    ],
    deliveryController.loginDeliveryman
);
module.exports = router;
