// backend/routes/formRoutes.js
const express = require('express')
const router = express.Router()
const Form = require('../models/Form') // Assuming Form is your Mongoose model

router.post('/form', async (req, res) => {
  try {
    const formData = req.body

    // Assuming Form is a Mongoose model
    const newForm = new Form(formData)
    await newForm.save()

    res.status(201).send(newForm)
  } catch (error) {
    console.error('Error while saving form data:', error)
    res
      .status(500)
      .send({ message: 'Internal Server Error', error: error.message })
  }
})

module.exports = router
