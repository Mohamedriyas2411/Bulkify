const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },

    name:{type:String, required:true},
    quantity:{type:Number, required:true},
    price:{type:Number, required:true},
    minQuantity:{type:Number,required: true},
    category:{type:String, default: 'General', required: true},
    description:{type:String, default: ''},
    discount:{type:Number, default:0},
    image:{type:String}
});

module.exports = mongoose.model('Product',ProductSchema);