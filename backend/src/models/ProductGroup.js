const mongoose = require('mongoose');

const ProductGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  // The community this group belongs to (optional, helps with filtering)
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  },
  members: [{
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer' },
    quantity: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    joinedAt: { type: Date, default: Date.now }
  }],
  targetQuantity: { type: Number, required: true }, // From Product's minQuantity
  currentQuantity: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['open', 'completed', 'expired'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductGroup', ProductGroupSchema);