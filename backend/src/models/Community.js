const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    area: {type: String, required: true, unique: true},
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    }],
    location:{
        latitude:{type: String, required: true},
        longitude:{type: String, required: true}
    },
    createdAt: {type: Date, default: Date.now}
    
});

module.exports = mongoose.model('Community', CommunitySchema);  