const mongoose = require('mongoose');
const BuyerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    phone:{
        type:String,
        required:true
    },
    password:{  
        type:String,
        required:true
    },
    location:{
        latitude:{
            type:String,
            required:true
        },
        longitude:{
            type:String,
            required:true
        }
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});
module.exports =  mongoose.model('Buyer',BuyerSchema);