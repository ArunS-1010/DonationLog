import React, { useState } from 'react'
import axios from 'axios'
import '../styles/FormPage.css'

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

      await axios.post('https://donationlog-backend.onrender.com/form', {
        ...formData,
        token,
      })
      alert('Form submitted successfully')
    } catch (error) {
      console.error(
        'Form submission failed:',
        error.response ? error.response.data : error.message
      )
    }
  }

  return (
    <div className="form-container">
      <h2>Enter the details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Name : </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="phoneNumber">Phone Number :</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="address">Address :</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            required
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="city">City :</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City"
            required
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="state">State :</label>
          <input
            type="text"
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-row">
          <label htmlFor="amountReceived">Amount Received :</label>
          <input
            type="number"
            id="amountReceived"
            name="amountReceived"
            placeholder="Amount Received"
            required
            value={formData.amountReceived}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="dateTime">Date & Time :</label>
          <input
            type="datetime-local"
            id="dateTime"
            name="dateTime"
            required
            value={new Date(formData.dateTime).toISOString().slice(0, 16)}
            onChange={handleChange}
          />
        </div>
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}

export default FormPage
