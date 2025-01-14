const mongoose = require('mongoose');
const User = require('../models/User');
const express = require('express');
const verifyToken = require('../utils/verifyToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const authConfig = {
    expireTime: '1d',
    refreshTokenExpireTime: '1d',
};

/**
 * @route GET /personal/me
 * @desc Fetch the authenticated user's personal details
 * @access Protected (Admin, Donor, Needy, Volunteer)
 */
router.get('/personal/me', verifyToken(['Admin', 'Donor', 'Needy', 'Volunteer']), async (req, res) => {
    try {
        // Fetch the user's details, excluding sensitive fields
        const user = await User.findById(req.user._id).select('-password -__v');

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.status(200).send({
            user,
            message: 'User details retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).send({
            message: 'An error occurred while retrieving user details',
            error: error.message
        });
    }
});

/**
 * @route GET /logout
 * @desc Logs the user out by clearing authentication cookies
 * @access Public
 */
router.get('/logout', async (req, res) => {
    try {
        // Clear the refresh token cookie and login status
        res.cookie('refreshToken', '', {
            httpOnly: true, // Prevent client-side access to the cookie
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'strict', // Mitigate CSRF attacks
            maxAge: 0, // Immediately expires the cookie
        });

        res.cookie('isLoggedIn', '', {
            httpOnly: false, // Client-side access is allowed for UI handling
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 0,
        });

        return res.status(200).send({
            status: 'success',
            message: 'Successfully logged out',
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).send({
            status: 'error',
            message: 'Internal server error while logging out',
        });
    }
});

router.get('/', verifyToken(['Admin', 'Donor', 'Needy', 'Volunteer']), async (req, res) => {
    const roleFilter = req.query.role !== '' && typeof req.query.role !== 'undefined' ? { role: req.query.role } : {};

    const filterParams = {
        $and: [
            roleFilter
        ],
    };

    const totalCount = await User.countDocuments({});
    const users = await User.find(filterParams).select('-password -__v');

    return res.send({
        totalCount,
        users,
        filteredCount: users.length,
    })
});

// Get One User by ID
router.get('/getOneUser/:id', verifyToken(['Admin', 'Volunteer']), async (req, res) => {
    const userId = req.params.id;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Malformed user ID' });
    }

    try {
        // Find user and exclude "__v" field
        const user = await User.findById(userId).select('-__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update User by ID
router.put('/update/:id', verifyToken(['Admin']), async (req, res) => {
    const userId = req.params.id;
    const updateValues = req.body;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Malformed user ID' });
    }

    try {
        // Update user and return the new document
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateValues,
            { new: true, runValidators: true } // Return the updated document and validate input
        ).select('-__v');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            updatedUser,
            message: 'User successfully updated',
        });
    } catch (error) {
        // Handle duplicate key error (e.g., unique email)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicated email. Email already exists.' });
        }
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create user endpoint
router.post('/create', verifyToken(['Admin']), async (req, res) => {
    const { username, email, password, phone, role, address, age, socio_economic_status, skills, availability } = req.body;

    // Validate required fields based on the user role
    if (!username || !email || !password || !role) {
        return res.status(400).send({ message: 'Username, email, password, and role are required.' });
    }

    // Check if the email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).send({ message: 'This Email already exists.' });
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(authConfig.saltLength || 10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Prepare the user data
        const userData = {
            username,
            email,
            password: hashPassword,
            role,
            phone,
        };

        // Add role-specific fields
        if (role === 'Needy') {
            // Validate fields specific to "Needy" role
            if (!address || !age || !socio_economic_status) {
                return res.status(400).send({
                    message: 'Address, Age, and Socio-economic status are required for Needy users.',
                });
            }
            userData.address = address.formatted_address;  // Assuming address is an object with a "formatted_address" field
            userData.age = age;
            userData.socio_economic_status = socio_economic_status;
        } else if (role === 'Volunteer') {
            // Validate fields specific to "Volunteer" role
            if (!skills || !availability) {
                return res.status(400).send({
                    message: 'Skills and Availability are required for Volunteer users.',
                });
            }
            userData.skills = skills;
            userData.availability = availability;
        }

        // Create and save the user
        const user = new User(userData);
        const savedUser = await user.save();

        // Remove password from the response object
        const responseUser = savedUser.toObject();
        delete responseUser.password;

        // Send the response
        return res.status(201).send({
            user: responseUser,
            message: 'User successfully created.',
        });

    } catch (error) {
        // Handle duplicate key error (e.g., unique email)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicated email. Email already exists.' });
        }

        // Log and return a generic server error for other issues
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/delete/:id', verifyToken(['Admin']), async (req, res) => {
    await User.deleteOne({ _id: req.params.id });
    return res.send({ message: 'User successfully deleted!' });
});

module.exports = router;
