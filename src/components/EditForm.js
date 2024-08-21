// EditForm.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const EditForm = ({ recordId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    amountReceived: '',
    dateTime: '',
  })

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/records/${recordId}`
        )
        setFormData(response.data)
      } catch (error) {
        console.error('Failed to fetch record:', error.message)
      }
    }

    fetchRecord()
  }, [recordId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:5000/records/${recordId}`, formData)
      onSave()
    } catch (error) {
      console.error('Failed to update record:', error.message)
    }
  }

  return (
    <div className="edit-form">
      <h2>Edit Record</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
        />
        <input
          type="number"
          name="amountReceived"
          value={formData.amountReceived}
          onChange={handleChange}
          placeholder="Amount Received"
        />
        <input
          type="datetime-local"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          placeholder="Date & Time"
        />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  )
}

export default EditForm
