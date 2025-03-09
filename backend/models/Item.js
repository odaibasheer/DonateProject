const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Money', 'Clothes', 'Food', 'Medical Supplies', 'Furniture', 'Other'], default: 'Money' },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String },
    purpose: { type: String, required: false },
    
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
