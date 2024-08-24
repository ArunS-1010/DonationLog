import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Records.css'

const Records = ({ username }) => {
  const [records, setRecords] = useState([])
  const [userRecords, setUserRecords] = useState([]) // Added this line
  const [totalAmount, setTotalAmount] = useState(0)
  const [userTotalAmount, setUserTotalAmount] = useState(0) // New state for user-specific total amount

  const [editingRecord, setEditingRecord] = useState(null)

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/records')
      const fetchedRecords = response.data

      // Calculate the total amount for all records
      const total = fetchedRecords.reduce(
        (sum, record) => sum + record.amountReceived,
        0
      )
      setTotalAmount(total)
      setRecords(fetchedRecords)

      // Filter records for the logged-in user
      const userSpecificRecords = fetchedRecords.filter(
        (record) => record.user.username === username
      )
      setUserRecords(userSpecificRecords)

      // Calculate the total amount for user-specific records
      const userTotal = userSpecificRecords.reduce(
        (sum, record) => sum + record.amountReceived,
        0
      )
      setUserTotalAmount(userTotal) // Set user-specific total amount
    } catch (error) {
      console.error('Failed to fetch records:', error.message)
    }
  }

  useEffect(() => {
    fetchRecords()
  })

  const handleEditClick = (record) => {
    setEditingRecord(record)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditingRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value,
    }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(
        `http://localhost:5000/records/${editingRecord._id}`,
        editingRecord
      )
      console.log('Edit successful:', response.data)
      setEditingRecord(null)
      fetchRecords()
    } catch (error) {
      console.error('Failed to edit record:', error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`http://localhost:5000/records/${id}`)
        fetchRecords()
      } catch (error) {
        console.error('Failed to delete record:', error.message)
      }
    }
  }

  const handlePrint = (record) => {
    const formattedDate = new Date(record.dateTime).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    })

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
        formattedDate +
        '</td></tr>'
    )
    printWindow.document.write('</table>')
    printWindow.document.write('</div>')
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  const downloadCSV = (recordsToDownload, filename) => {
    const csvRows = []

    // Add the header row
    const headers = [
      'Name',
      'Phone Number',
      'Address',
      'City',
      'State',
      'Amount Received',
      'Date & Time',
      'Received by',
    ]
    csvRows.push(headers.join(','))

    // Add the data rows
    recordsToDownload.forEach((record) => {
      const row = [
        `"${record.name}"`,
        `"${record.phoneNumber}"`,
        `"${record.address}"`,
        `"${record.city}"`,
        `"${record.state}"`,
        record.amountReceived,
        `"${new Date(record.dateTime).toLocaleString()}"`,
        `"${record.user.username}"`,
      ]
      csvRows.push(row.join(','))
    })

    // Convert the rows to a CSV string
    const csvString = csvRows.join('\n')

    // Create a Blob from the CSV string and generate a download link
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="container">
      <p className="sub-heading">
        Donations received by: <span>{username}</span>{' '}
      </p>
      <table className="user-records-table" border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Amount Received</th>
            <th>Date & Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userRecords.map((record) => (
            <tr key={record._id}>
              <td>{record.name}</td>
              <td>{record.phoneNumber}</td>
              <td>{record.address}</td>
              <td>{record.city}</td>
              <td>{record.state}</td>
              <td>{record.amountReceived}</td>
              <td>{new Date(record.dateTime).toLocaleString()}</td>
              <td>
                <button
                  className="edit-btn btn"
                  onClick={() => handleEditClick(record)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn btn"
                  onClick={() => handleDelete(record._id)}
                >
                  Delete
                </button>
                <button
                  className="print-btn btn"
                  onClick={() => handlePrint(record)}
                >
                  Print
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td className="total" colspan="5">
              Total Amount Received:{' '}
            </td>
            <td className="totalno" colspan="4">
              {userTotalAmount}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="download-container">
        <button
          className="download-btn"
          onClick={() => downloadCSV(userRecords, 'user-records.csv')}
        >
          Download
        </button>
      </div>

      <p className="sub-heading">Overall Records</p>
      <table className="overall-records-table" border="1">
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
                <button
                  className="edit-btn btn"
                  onClick={() => handleEditClick(record)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn btn"
                  onClick={() => handleDelete(record._id)}
                >
                  Delete
                </button>
                <button
                  className="print-btn btn"
                  onClick={() => handlePrint(record)}
                >
                  Print
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td className="total" colspan="5">
              Total Amount Received:{' '}
            </td>
            <td className="totalno" colspan="4">
              {totalAmount}
            </td>
          </tr>
        </tbody>
      </table>
      {/* <div className="total-amount">
        <strong>Total Amount Received: {totalAmount}</strong>
      </div> */}
      <div className="download-container">
        <button
          className="download-btn"
          onClick={() => downloadCSV(records, 'overall-records.csv')}
        >
          Download
        </button>
      </div>

      {/* Edit Form Popup */}
      {editingRecord && (
        <div className="popup-overlay">
          <div className="popup">
            <button
              className="popup-close-button"
              onClick={() => setEditingRecord(null)}
            >
              ×
            </button>
            <h3>Edit Record</h3>
            <form className="popup-form" onSubmit={handleEditSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={editingRecord.name}
                onChange={handleEditChange}
                required
              />
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={editingRecord.phoneNumber}
                onChange={handleEditChange}
                required
              />
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={editingRecord.address}
                onChange={handleEditChange}
                required
              />
              <label>City</label>
              <input
                type="text"
                name="city"
                value={editingRecord.city}
                onChange={handleEditChange}
                required
              />
              <label>State</label>
              <input
                type="text"
                name="state"
                value={editingRecord.state}
                onChange={handleEditChange}
                required
              />
              <label>Amount Received</label>
              <input
                type="number"
                name="amountReceived"
                value={editingRecord.amountReceived}
                onChange={handleEditChange}
                required
              />
              <label>Date & Time (Default)</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={editingRecord.dateTime.slice(0, 16)} // Truncate to match datetime-local format
                onChange={handleEditChange}
                required
              />
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Records
