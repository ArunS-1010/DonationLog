import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Records.css'

const Records = () => {
  const [records, setRecords] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/records')
      const fetchedRecords = response.data

      // Calculate the total amount received
      const total = fetchedRecords.reduce(
        (sum, record) => sum + record.amountReceived,
        0
      )
      setTotalAmount(total)

      setRecords(fetchedRecords)
    } catch (error) {
      console.error('Failed to fetch records:', error.message)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleEdit = async (id) => {
    // Gather the updated data from a form or other input
    const updatedData = {
      name: 'New Name',
      phoneNumber: '1234567890',
      address: 'New Address',
      city: 'New City',
      state: 'New State',
      amountReceived: 500,
      dateTime: new Date().toISOString(),
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/records/${id}`,
        updatedData
      )
      console.log('Edit successful:', response.data)
      fetchRecords() // Refresh the records list to show the updated data
    } catch (error) {
      console.error('Failed to edit record:', error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`http://localhost:5000/records/${id}`)
        fetchRecords() // Refresh the records list after deletion
      } catch (error) {
        console.error('Failed to delete record:', error.message)
      }
    }
  }

  const handlePrint = (record) => {
    const printWindow = window.open('', '_blank', 'width=400', 'height=500')
    printWindow.document.write('<html><head><title>Print</title>')
    printWindow.document.write('<style>')
    printWindow.document.write(`
      body {
        font-family: Arial, sans-serif;
      }
      .print-container {
        width: 80%;
        margin: 160px auto 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td {
        padding: 8px;
        vertical-align: top;
      }
      .title {
        font-weight: bold;
        width: 40%;
      }
      .data {
        width: 60%;
      }
    `)
    printWindow.document.write('</style></head><body>')
    printWindow.document.write('<div class="print-container">')
    printWindow.document.write('<table>')
    printWindow.document.write(
      '<tr><td class="title">Name:</td><td class="data">' +
        record.name +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">Phone no:</td><td class="data">' +
        record.phoneNumber +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">Address:</td><td class="data">' +
        record.address +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">City:</td><td class="data">' +
        record.city +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">State:</td><td class="data">' +
        record.state +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">Amount Received:</td><td class="data">' +
        record.amountReceived +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">Date & Time:</td><td class="data">' +
        record.dateTime +
        '</td></tr>'
    )
    printWindow.document.write('</table>')
    printWindow.document.write('</div>')
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="container">
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
            <th>Received by</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.name}</td>
              <td>{record.phoneNumber}</td>
              <td>{record.address}</td>
              <td>{record.city}</td>
              <td>{record.state}</td>
              <td>{record.amountReceived}</td>
              <td>{new Date(record.dateTime).toLocaleString()}</td>
              <td>{record.user.username}</td>
              <td>
                <button onClick={() => handleEdit(record._id)}>Edit</button>
                <button onClick={() => handleDelete(record._id)}>Delete</button>
                <button onClick={() => handlePrint(record)}>Print</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Amount Received: {totalAmount}</p>
    </div>
  )
}

export default Records
