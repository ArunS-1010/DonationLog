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

    const token = jwt.sign(
      { userId: user._id },
      '7aa0f2cc1a5d1a2ed948b8f0fef8888d99bbbfd1e191aaf390b2c8d2bdf8dc4f',
      {
        expiresIn: '1h',
      }
    )
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
    const decoded = jwt.verify(
      token,
      '7aa0f2cc1a5d1a2ed948b8f0fef8888d99bbbfd1e191aaf390b2c8d2bdf8dc4f'
    )
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
