const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

let refreshTokens = [];

const authConfig = {
    expireTime: '1d',
    refreshTokenExpireTime: '1d',
};

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone, role, address, age, socio_economic_status, skills, availability } = req.body;

        // Check if the email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).send({ message: 'This Email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(authConfig.saltLength || 10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create a new user object
        const userData = {
            username,
            email,
            password: hashPassword,
            role,
            phone,
        };

        // Add role-specific fields
        if (role === 'Needy') {
            if (!address || !age || !socio_economic_status) {
                return res.status(400).send({
                    message: 'Address, Age, and Socio-economic status are required for Needy users.',
                });
            }
            userData.address = address.formatted_address;
            userData.age = age;
            userData.socio_economic_status = socio_economic_status;
        } else if (role === 'Volunteer') {
            if (!skills || !availability) {
                return res.status(400).send({
                    message: 'Skills and Availability are required for Volunteer users.',
                });
            }
            userData.skills = skills;
            userData.availability = availability;
        }

        // Save the new user
        const user = new User(userData);
        const savedUser = await user.save();

        // Generate an access token
        const accessToken = jwt.sign(
            { _id: savedUser._id, role: savedUser.role },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: authConfig.expireTime || '1h' }
        );

        // Remove password from the response
        const responseUser = { ...savedUser._doc };
        delete responseUser.password;

        return res.status(201).send({
            user: responseUser,
            accessToken,
            message: 'User successfully registered.',
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).send({ message: 'Server error occurred while registering.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password, remember } = req.body;

        // Check if the user exists and update the last login timestamp
        const user = await User.findOneAndUpdate(
            { email },
            { lastLogin: new Date() },
            { new: true }
        ).select('-__v');
        
        if (!user) {
            return res.status(400).send({ message: 'Email provided is not a registered account' });
        }

        // Check if the user's role is allowed to log in
        if (user.role === 'Admin') {
            return res.status(403).send({ message: 'User role is not allowed' });
        }

        // Validate the password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).send({ message: 'Email or password is incorrect!' });
        }

        // Determine token expiry based on 'remember me' option
        const tokenExpiry = remember ? '30d' : authConfig.expireTime || '1h';

        // Generate access and refresh tokens
        const accessToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: tokenExpiry }
        );
        const refreshToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: authConfig.refreshTokenExpireTime || '7d' }
        );

        // Store the refresh token securely
        refreshTokens.push(refreshToken); // Make sure to define and handle this securely

        // Remove password from the response
        const userResponse = { ...user._doc };
        delete userResponse.password;

        // Set cookies for tokens
        const cookieOptions = {
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
        };
        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
        res.cookie('isLoggedIn', true, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        // Send response with user data and tokens
        return res.status(200).send({
            userData: userResponse,
            accessToken,
            refreshToken,
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send({ message: 'Server error occurred while logging in.' });
    }
});

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password, remember } = req.body;

        // Check if the user exists and update the last login timestamp
        const user = await User.findOneAndUpdate(
            { email },
            { lastLogin: new Date() },
            { new: true }
        ).select('-__v');

        if (!user) {
            return res.status(404).send({ message: 'Email provided is not a registered account' });
        }

        // Validate the user's role
        if (user.role !== 'Admin') {
            return res.status(403).send({ message: 'User role is not allowed' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Email or password is incorrect!' });
        }

        // Generate tokens with appropriate expiry times
        const tokenExpiry = remember ? '30d' : authConfig.expireTime || '1h';
        const accessToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: tokenExpiry }
        );
        const refreshToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: authConfig.refreshTokenExpireTime || '7d' }
        );

        // Add the refresh token to a secure storage mechanism (e.g., in-memory or database)
        refreshTokens.push(refreshToken); // Ensure this is stored securely and handled correctly

        // Remove sensitive fields from the user object
        const userResponse = { ...user._doc };
        delete userResponse.password;

        // Set secure cookies for tokens
        const cookieOptions = {
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
        };

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        res.cookie('isLoggedIn', true, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        // Return the response with user data and access token
        return res.status(200).send({
            userData: userResponse,
            accessToken,
            refreshToken,
            message: 'Admin login successful',
        });
    } catch (error) {
        console.error('Error during admin login:', error);
        return res.status(500).send({ message: 'Server error occurred during login.' });
    }
});

router.get('/refreshToken', async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).send({ message: 'Refresh token not provided' });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { _id } = decoded;

        // Fetch the user data
        const userData = await User.findById(_id).select('-__v -password');
        if (!userData) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Generate new access and refresh tokens
        const newAccessToken = jwt.sign(
            { _id: userData._id, role: userData.role },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: authConfig.expireTime || '1h' }
        );
        const newRefreshToken = jwt.sign(
            { _id: userData._id, role: userData.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: authConfig.refreshTokenExpireTime || '7d' }
        );

        // Securely set the new refresh token in cookies
        const cookieOptions = {
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        };

        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        // Return the new tokens and user data
        return res.status(200).send({
            user: userData,
            accessToken: newAccessToken,
            message: 'Token refreshed successfully',
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(401).send({ message: 'Invalid or expired refresh token' });
    }
});

module.exports = router;