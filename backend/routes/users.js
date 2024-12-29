const mongoose = require('mongoose');
const User = require('../models/User');
const express = require('express');
const verifyToken = require('../utils/verifyToken');
const router = express.Router();

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

module.exports = router;
