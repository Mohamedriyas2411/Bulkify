const mongoose = require('mongoose');
const DeliverymanSchema = new mongoose.Schema({
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
    }
});
module.exports = mongoose.model('Deliveryman',DeliverymanSchema);
