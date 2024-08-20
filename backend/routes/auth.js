// backend/routes/auth.js
const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.post('/signup', async (req, res) => {
  const { username, password } = req.body

  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    const newUser = new User({ username, password })
    await newUser.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// backend/routes/auth.js
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: 'Username not found' })
    }

    if (user.password !== password) {
      // Consider using a more secure method like bcrypt
      return res.status(400).json({ message: 'Incorrect password' })
    }

    res.status(200).json({ message: 'Login successful' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
