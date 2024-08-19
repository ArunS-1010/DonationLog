// src/components/FormPage.js
import React, { useState } from 'react'
import axios from 'axios'

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    amountReceived: '',
    dateTime: new Date().toISOString(),
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/form', formData)
      alert('Form submitted successfully')
    } catch (error) {
      console.error('Form submission failed:', error)
    }
  }

  return (
    <div>
      <h2>Fill out the form</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        onChange={handleChange}
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        onChange={handleChange}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        onChange={handleChange}
      />
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amountReceived"
        placeholder="Amount Received"
        onChange={handleChange}
      />
      <input
        type="datetime-local"
        name="dateTime"
        value={formData.dateTime}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default FormPage
