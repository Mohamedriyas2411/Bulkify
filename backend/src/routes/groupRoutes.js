const express = require('express');
const router = express.Router();
const authBuyer = require('../middleware/authBuyer');
const groupController = require('../controllers/groupController');

router.post('/payment/order', authBuyer, groupController.createPaymentOrder); // New Route
router.post('/create', authBuyer, groupController.createGroup);
router.post('/join/:id', authBuyer, groupController.joinGroup);
router.get('/recommended', authBuyer, groupController.getRecommendedGroups);
router.get('/mygroups', authBuyer, groupController.getMyGroups);

module.exports = router;