// server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./models/User')
const Form = require('./models/Form')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// MongoDB Atlas connection
mongoose.connect(
  'mongodb+srv://user:user@cluster0.pvjaf.mongodb.net/yourdbname?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

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

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
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
    const decoded = jwt.verify(token, 'your-secret-key')
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
