const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assistance: { type: mongoose.Schema.Types.ObjectId, ref: 'Assistance', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
