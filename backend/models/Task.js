const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Pickup', 'Delivery'], default: 'Pickup' },
    location: { type: String, required: true },
    assign: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);