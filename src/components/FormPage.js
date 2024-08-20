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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token') // Retrieve the token from localStorage
      if (!token) {
        throw new Error('No token found')
      }

      await axios.post('http://localhost:5000/form', { ...formData, token })
      alert('Form submitted successfully')
    } catch (error) {
      console.error(
        'Form submission failed:',
        error.response ? error.response.data : error.message
      )
    }
  }

  return (
    <div>
      <h2>Fill out the form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div>
          <label>Amount Received</label>
          <input
            type="number"
            name="amountReceived"
            placeholder="Amount Received"
            value={formData.amountReceived}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={new Date(formData.dateTime).toISOString().slice(0, 16)}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default FormPage
