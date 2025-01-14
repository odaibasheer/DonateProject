const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['Admin', 'Donor', 'Needy', 'Volunteer'],
            default: 'Volunteer',
            required: true,
        },
        phone: { type: String, required: true },
        // Fields specific to Needy
        address: { type: String, required: function () { return this.role === 'Needy'; } },
        age: { type: Number, required: function () { return this.role === 'Needy'; } },
        socio_economic_status: {
            type: String,
            required: function () { return this.role === 'Needy'; }
        },
        // Fields specific to Volunteer
        skills: { type: String, required: function () { return this.role === 'Volunteer'; } },
        availability: { type: String, required: function () { return this.role === 'Volunteer'; } },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
