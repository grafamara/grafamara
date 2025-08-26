const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like Outlook, etc.
    auth: {
        user: 'YOUR_EMAIL@gmail.com', // REPLACE WITH YOUR EMAIL
        pass: 'YOUR_PASSWORD' // REPLACE WITH YOUR EMAIL PASSWORD
    }
});

// API endpoint for sending emails
app.post('/send-email', (req, res) => {
    const { firstName, lastName, email, phone } = req.body;

    const mailOptions = {
        from: email,
        to: 'YOUR_EMAIL@gmail.com', // REPLACE WITH YOUR EMAIL
        subject: `New message from ${firstName} ${lastName}`,
        text: `You have a new message from:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Something went wrong.');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully!');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
