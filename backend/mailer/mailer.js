const nodemailer = require('nodemailer');
require('dotenv').config();

// In-memory store for OTPs (consider using a database in production)
const otpStore = {};

// Function to generate a random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    // port: 465,
    secure: false,
    port: 587,
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // App password
    },
    tls: {
        rejectUnauthorized: false, // Skip certificate validation
    },
});

        // const otp = generateOTP();
        // otpStore[email] = otp; // Save OTP in memory

        // const mailOptions = {
        //     from: process.env.GMAIL_USER, // Sender email
        //     to: email, // Receiver email
        //     subject: 'Your OTP Code',
        //     html: `
        //         <h2>OTP Verification</h2>
        //         <p>Your OTP code is:</p>
        //         <h3>${otp}</h3>
        //         <p>It is valid for 5 minutes.</p>
        //     `,
        // };


// await transporter.sendMail(mailOptions);

module.exports = {generateOTP, transporter}