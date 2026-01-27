const express = require('express');
const router = express.Router();
const authBuyer = require('../middleware/authBuyer');
const communityController = require('../controllers/communityController');

router.post('/create', authBuyer, communityController.createCommunity);
router.get('/nearby', authBuyer, communityController.getNearbyCommunities);
router.get('/joined', authBuyer, communityController.getJoinedCommunities);
router.put('/join/:id', authBuyer, communityController.joinCommunity);
router.put('/leave/:id', authBuyer, communityController.leaveCommunity);
router.delete('/delete/:id', authBuyer, communityController.deleteCommunity);

module.exports = router;