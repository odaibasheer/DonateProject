const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to the database.');

        // Check if an Admin already exists
        const existingAdmin = await User.findOne({ role: 'Admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Skipping seed.');
            return;
        }

        // Create Admin User
        const adminData = {
            username: 'Super Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'Admin',
        };

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, salt);

        // Save Admin User
        const adminUser = new User(adminData);
        await adminUser.save();
        console.log('Admin user seeded successfully.');
    } catch (error) {
        console.error('Error seeding Admin user:', error.message);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('Disconnected from the database.');
    }
};

// Execute the seed function
seedAdmin();
