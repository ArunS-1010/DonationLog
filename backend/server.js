require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const bodyParser = require('body-parser')

const User = require('./models/User')
const Admin = require('./models/Admin')
const Form = require('./models/Form')

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

// Variables to store OTPs
let generatedOTP = null // Store generated OTP
let emailForOTP = null // Store the email that will receive the OTP

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

// MongoDB Atlas connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Email OTP functionality
let emailOTPs = {}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use true if connecting via TLS (port 465)
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
})

// Function to generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString()
}

// Route to send OTP to user email
app.post('/send-otp', (req, res) => {
  const { email } = req.body

  // Validate the email input
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  // Generate a 6-digit OTP
  generatedOTP = generateOTP()
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

// Verify OTP for user email
// POST route to verify OTP
app.post('/verify-otp', (req, res) => {
  const { otp } = req.body

  // console.log('Received OTP:', otp) // Debug: Print received OTP
  // console.log('Stored OTP:', generatedOTP) // Debug: Print stored OTP

  if (!otp) {
    return res.status(400).json({ error: 'OTP is required' })
  }

  if (String(otp) === String(generatedOTP)) {
    generatedOTP = null
    res.status(200).json({ message: 'OTP verified successfully' })
  } else {
    res.status(400).json({ error: 'Invalid OTP' })
  }
})

// Routes for admin OTP and verification (similar to user OTP)
// Route to send OTP to admin email
app.post('/admin/send-otp', (req, res) => {
  const { email } = req.body

  // Validate the email input
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  // Generate a 6-digit OTP
  const otp = generateOTP()

  // Store OTP in emailOTPs object
  emailOTPs[email] = otp

  // Set up email options
  const mailOptions = {
    from: EMAIL_USER,
    to: email, // Send OTP to the specified email
    subject: 'Your Admin OTP Code',
    text: `Your OTP code is ${otp}`, // Include the generated OTP
  }

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
      return res
        .status(500)
        .json({ error: 'Failed to send Admin OTP', details: error.message })
    }
    res.status(200).json({ message: 'Admin OTP sent successfully' })
  })
})

// Route to verify OTP for admin email
app.post('/admin/verify-otp', (req, res) => {
  const { email, otp } = req.body

  // Validate OTP and email
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' })
  }

  // Check if the provided OTP matches the generated OTP
  if (emailOTPs[email] && emailOTPs[email] === otp) {
    delete emailOTPs[email] // Remove OTP after verification
    res.status(200).json({ message: 'Admin OTP verified successfully' })
  } else {
    res.status(400).json({ error: 'Invalid OTP' })
  }
})

// Signup Route
// server.js
app.post('/signup', async (req, res) => {
  const { username, password, email, phoneNumber } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber })
    if (existingPhoneNumber) {
      return res.status(400).json({ error: 'Phone number already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    })
    await newUser.save()
    res.status(201).json({ message: 'User created' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    })
    res.json({ success: true, token })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Form Submission Route
app.post('/form', async (req, res) => {
  const { token, ...formData } = req.body

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const newForm = new Form({ ...formData, user: user._id })
    await newForm.save()
    res.status(201).json({ message: 'Form data saved' })
  } catch (error) {
    console.error('Error saving form data:', error)
    res
      .status(500)
      .json({ error: 'Failed to save form data', details: error.message })
  }
})

// Get Records Route
app.get('/records', async (req, res) => {
  try {
    const records = await Form.find().populate('user')
    res.json(records)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' })
  }
})

// Edit Record Route
app.put('/records/:id', async (req, res) => {
  const { id } = req.params
  const updatedData = req.body

  try {
    const updatedRecord = await Form.findByIdAndUpdate(id, updatedData, {
      new: true,
    })

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' })
    }

    res
      .status(200)
      .json({ message: 'Record updated successfully', updatedRecord })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record' })
  }
})

// Delete Record Route
app.delete('/records/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedRecord = await Form.findByIdAndDelete(id)

    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' })
    }

    res.status(200).json({ message: 'Record deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record' })
  }
})

// for admin
// Admin Signup Route
// Admin Signup Route in server.js
app.post('/admin/signup', async (req, res) => {
  const { username, password, email, phoneNumber } = req.body

  // Basic validation
  if (!username || !password || !email || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const existingEmail = await Admin.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const existingPhoneNumber = await Admin.findOne({ phoneNumber })
    if (existingPhoneNumber) {
      return res.status(400).json({ error: 'Phone number already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    })
    await newAdmin.save()
    res.status(201).json({ message: 'Admin created successfully' })
  } catch (error) {
    console.error('Error creating admin:', error)
    res.status(500).json({ error: 'Failed to create admin' })
  }
})

// Admin Login Route
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ username })
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, {
      expiresIn: '1h',
    })
    res.json({ success: true, token })
  } catch (error) {
    console.error('Login failed:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(express.json())
