// src/components/Records.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Records = ({ newRecord }) => {
  const [records, setRecords] = useState([])

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/records')
        setRecords(response.data)
      } catch (error) {
        console.error('Failed to fetch records:', error)
      }
    }

    fetchRecords()
  }, [])

  useEffect(() => {
    if (newRecord) {
      setRecords((prevRecords) => [...prevRecords, newRecord])
    }
  }, [newRecord])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString() // Convert to local time
  }

  return (
    <div>
      <h2>Records</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Amount Received</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.name}</td>
              <td>{record.phoneNumber}</td>
              <td>{record.address}</td>
              <td>{record.city}</td>
              <td>{record.state}</td>
              <td>{record.amountReceived}</td>
              <td>{formatDate(record.dateTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Records
