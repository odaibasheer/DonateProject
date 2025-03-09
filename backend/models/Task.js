const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        type: { type: String, enum: ['Pickup', 'Delivery'], default: 'Pickup' },
        location: { type: String, required: true },
        assign: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], default: 'Pending' },
        urgency: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
        assistance: { type: mongoose.Schema.Types.ObjectId, ref: 'Assistance', required: true },
        donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        quantity: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
