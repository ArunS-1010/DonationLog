const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors()) // Enable CORS for cross-origin requests
app.use(bodyParser.json()) // Enable parsing of JSON bodies

// Variables to store OTPs
let generatedOTP = null // Store generated OTP
let emailForOTP = null // Store the email that will receive the OTP

// POST route to send OTP
app.post('/send-otp', (req, res) => {
  const { email } = req.body

  // Validate the email input
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  // Generate a 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000)
  emailForOTP = email // Store the email to verify later

  // Nodemailer setup for sending OTP via email
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    auth: {
      user: process.env.EMAIL, // Email credentials from .env
      pass: process.env.PASSWORD, // Password credentials from .env
    },
    tls: {
      rejectUnauthorized: false, // Disable strict certificate checking
    },
  })

  // Set up email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: email, // Send OTP to the specified email
    subject: 'Your OTP Code',
    text: `Your OTP code is ${generatedOTP}`, // Include the generated OTP
  }

  // Customize the email body in HTML format
  // Set up email options with HTML

  // const mailOptions = {
  //     from: process.env.EMAIL,
  //     to: email,
  //     subject: 'Your OTP Code',
  //     html: `
  //       <div>
  //         <p>Hello,</p>
  //         <p>Your OTP code is <strong>${generatedOTP}</strong>.</p>
  //         <p>Please use this code to verify your email address.</p>
  //         <p>If you did not request this OTP, please ignore this message.</p>
  //         <p>Best regards,<br>Your Company Name</p>
  //       </div>
  //     `,
  //   };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
      return res
        .status(500)
        .json({ error: 'Failed to send OTP', details: error.message })
    }
    res.status(200).json({ message: 'OTP sent successfully' })
  })
})

// POST route to verify OTP
app.post('/verify-otp', (req, res) => {
  const { otp } = req.body

  // Validate OTP
  if (!otp) {
    return res.status(400).json({ error: 'OTP is required' })
  }

  // Check if the provided OTP matches the generated OTP
  if (otp == generatedOTP) {
    res.status(200).json({ message: 'OTP verified successfully' })
  } else {
    res.status(400).json({ error: 'Invalid OTP' })
  }
})

// Start the server on a given port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
