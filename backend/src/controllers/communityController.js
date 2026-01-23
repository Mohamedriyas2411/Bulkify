const Community = require('../models/Community');
const Buyer = require('../models/Buyer');

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2){
    const R = 6371; // Radius of the earth in km    
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;

}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

exports.createCommunity = async (req, res) => {
    try{
        const {name, area, location} = req.body;

        const newCommunity = new Community({
            name,
            area,
            location,
            leader: req.buyer.id,
            members: [req.buyer.id]
    });

    await newCommunity.save();
    res.json(newCommunity);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getNearbyCommunities = async (req, res) => {
    try{
        const buyer = await Buyer.findById(req.buyer.id);
        if(!buyer) return res.status(404).json({msg: 'Buyer not found'});

        const buyerlat = parseFloat(buyer.location.latitude);
        const buyerlon = parseFloat(buyer.location.longitude);

        const allCommunties = await Community.find({});

        const nearby = allCommunities.filter(comm =>{
            const isMember = comm.members.some(memberId => memberId.toString() === req.buyer.id);
            if(isMember) return false;

            const commlat = parseFloat(comm.location.latitude);
            const commlon = parseFloat(comm.location.longitude);

            const dist = getDistanceFromLatLonInKm(buyerlat, buyerlon, commlat, commlon);
            return dist <= 1; // within 1 km
        });
        res.json(nearby);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');       
    } 
};

exports.getJoinedCommunities = async (req, res) => {
    try{
        const communties = await Community.find({members: req.buyer.id});
        res.json(communties);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.joinCommunity = async (req, res) => {
    try{
        const community = await Community.findById(req.params.id);
        if(!community) return res.status(404).json({msg: 'Community not found'});
        if(community.members.includes(req.buyer.id)){
            return res.status(400).json({msg: 'Already a member of this community'});
        }
        community.members.push(req.buyer.id);
        await community.save();
        res.json(community);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }       
};

exports.leaveCommunity = async (req, res) => {
    try{
        const community = await Community.findById(req.params.id);
        if(!community) return res.status(404).json({msg: 'Community not found'});

        community.members = community.members.filter(memberId => memberId.toString() !== req.buyer.id);
        await community.save();
        res.json(community);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ... existing imports

// @route   DELETE api/communities/delete/:id
exports.deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ msg: 'Community not found' });

    // Ensure only the leader can delete
    if (community.leader.toString() !== req.buyer.id) {
      return res.status(401).json({ msg: 'Not authorized. Only the leader can delete this community.' });
    }

    await Community.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Community deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};