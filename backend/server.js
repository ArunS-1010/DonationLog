// backend/server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// MongoDB Atlas connection
mongoose.connect(
  'mongodb+srv://user:user@cluster0.pvjaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
})

const User = mongoose.model('User', userSchema)

// Form Schema
const formSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  address: String,
  city: String,
  state: String,
  amountReceived: Number,
  dateTime: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const Form = mongoose.model('Form', formSchema)

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body

  try {
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

    const token = jwt.sign({ userId: user._id }, 'your-secret-key')
    res.json({ success: true, token })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Form Submission Route
app.post('/form', async (req, res) => {
  const { token, ...formData } = req.body

  try {
    const decoded = jwt.verify(token, 'your-secret-key')
    const user = await User.findById(decoded.userId)

    const newForm = new Form({ ...formData, user: user._id })
    await newForm.save()
    res.status(201).json({ message: 'Form data saved' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save form data' })
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
