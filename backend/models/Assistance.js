const mongoose = require('mongoose');

const assistanceSchema = new mongoose.Schema({
    type: { type: String, enum: ['Money', 'Clothes', 'Food', 'Medical Supplies', 'Furniture', 'Financial Support', 'Legal Aid', 'Other'], default: 'Money' },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    supporting_document: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Assistance', assistanceSchema);
