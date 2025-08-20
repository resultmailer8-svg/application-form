require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create mail transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    debug: true // Enable debug logging
});

// Verify transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.log('Server error:', error);
    } else {
        console.log('Server is ready to take messages');
    }
});

app.post('/submit-application', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, streetAddress, city, state, zipCode } = req.body;

        const mailOptions = {
            from: `"Job Application Form" <${process.env.EMAIL_USER}>`,
            to: 'markcarpenter396@gmail.com',
            subject: `New Job Application - ${firstName} ${lastName}`,
            text: `
New Job Application Submission

Applicant Information:
--------------------
${firstName} ${lastName}
${streetAddress}
${city}, ${state} ${zipCode}
${email}
${phone}
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            message: 'Failed to submit application',
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
