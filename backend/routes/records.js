const express = require('express')
const router = express.Router()
const Form = require('../models/Form')

router.get('/', async (req, res) => {
  try {
    const records = await Form.find()
    res.status(200).json(records)
  } catch (error) {
    console.error('Error fetching records:', error.message)
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
})

module.exports = router
