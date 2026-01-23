const mongoose= require('mongoose');
const CartSchema= new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 1
    },
});

module.exports= mongoose.model('Cart', CartSchema);