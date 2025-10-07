const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer setup to send emails via Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- OTP REGISTRATION FLOW ---

// STEP 1: Request an OTP for a new registration
// POST /api/auth/request-email-otp
router.post('/request-email-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.create({ email, otp });

        await transporter.sendMail({
            from: `"MedWell" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your MedWell Verification Code',
            text: `Your OTP for MedWell registration is: ${otp}. It will expire in 5 minutes.`,
            html: `<div style="font-family: sans-serif; text-align: center; padding: 20px;"><h2>MedWell Verification</h2><p>Your one-time password is:</p><p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; background: #f0f0f0; padding: 10px; border-radius: 5px;">${otp}</p><p>This code will expire in 5 minutes.</p></div>`,
        });

        res.status(200).json({ message: 'Verification code sent to your email.' });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: 'Error sending verification code.' });
    }
});

// STEP 2: Verify OTP and complete the registration
// POST /api/auth/verify-email-otp
router.post('/verify-email-otp', async (req, res) => {
    try {
        const { name, email, password, mobile, place, otp } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        const newUser = await User.create({ name, email, password, mobile, place });
        await OTP.deleteMany({ email }); // Clean up used OTPs

        if (newUser) {
            res.status(201).json({
                success: true,
                message: 'Registration successful! Please log in.'
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Error verifying OTP and registering:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});


// --- LOGIN ROUTE ---

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
                user: { id: user._id, name: user.name, email: user.email }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
});


// --- OTP PASSWORD RESET FLOW ---

// STEP 1: Request an OTP for a password reset
// POST /api/auth/request-password-reset-otp
router.post('/request-password-reset-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: 'If an account with this email exists, a verification code has been sent.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.create({ email, otp });

        await transporter.sendMail({
            from: `"MedWell" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your MedWell Password Reset Code',
            html: `<div style="font-family: sans-serif; text-align: center; padding: 20px;"><h2>MedWell Password Reset</h2><p>Your one-time password is:</p><p style="font-size: 24px; font-weight: bold;">${otp}</p><p>This code will expire in 5 minutes.</p></div>`,
        });

        res.status(200).json({ message: 'A verification code has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending verification code.' });
    }
});

// STEP 2: Verify the OTP for password reset
// POST /api/auth/verify-password-reset-otp
router.post('/verify-password-reset-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        const user = await User.findOne({ email });
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

        await OTP.deleteMany({ email });

        res.status(200).json({ success: true, resetToken });

    } catch (error) {
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
});


// STEP 3: Reset the password using the temporary token
// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: 'Missing information.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.password = password;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
});


module.exports = router;