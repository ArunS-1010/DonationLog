require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./models/User')
const Form = require('./models/Form')
const Admin = require('./models/Admin')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

// MongoDB Atlas connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, password: hashedPassword })
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
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    // Check if user already exists
    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newAdmin = new Admin({ username, password: hashedPassword })
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
