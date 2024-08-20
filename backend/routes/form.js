// backend/routes/form.js
const express = require('express')
const router = express.Router()
const Form = require('../models/Form') // Ensure the model path is correct

router.post('/', async (req, res) => {
  try {
    const formData = new Form(req.body)
    await formData.save()
    res.status(201).json(formData)
  } catch (error) {
    console.error('Error saving form data:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

module.exports = router
