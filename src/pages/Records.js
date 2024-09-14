import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/Records.css'

import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { IoMdPrint } from 'react-icons/io'
import { LiaSortSolid } from 'react-icons/lia'
import SearchFilterContainer from '../components/SearchFilterContainer'

const Records = ({ username }) => {
  const [userRecords, setUserRecords] = useState([])
  const [userTotalAmount, setUserTotalAmount] = useState(0)
  const [editingRecord, setEditingRecord] = useState(null)

  // State for search, filter, and sort
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAmount, setFilterAmount] = useState('')
  const [filterType, setFilterType] = useState('greater')
  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const fetchRecords = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/records')
      const fetchedRecords = response.data

      const userSpecificRecords = fetchedRecords.filter(
        (record) => record.user.username === username
      )
      setUserRecords(userSpecificRecords)

      const userTotal = userSpecificRecords.reduce(
        (sum, record) => sum + record.amountReceived,
        0
      )
      setUserTotalAmount(userTotal)
    } catch (error) {
      console.error('Failed to fetch records:', error.message)
    }
  }, [username])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  // Handle search, filter, and sorting logic
  const filteredRecords = userRecords
    .filter((record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((record) => {
      if (!filterAmount) return true
      switch (filterType) {
        case 'greater':
          return record.amountReceived > filterAmount
        case 'less':
          return record.amountReceived < filterAmount
        case 'equals':
          return record.amountReceived === parseInt(filterAmount, 10)
        default:
          return true
      }
    })
    .sort((a, b) => {
      if (!sortColumn) return 0
      if (sortOrder === 'asc') return a[sortColumn] > b[sortColumn] ? 1 : -1
      return a[sortColumn] < b[sortColumn] ? 1 : -1
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
      setEditingRecord(null)
      fetchRecords()
    } catch (error) {
      console.error('Failed to edit record:', error.message)
    }
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
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
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    printWindow.document.write('<html><head><title>Print</title>')
    printWindow.document.write('<style>')
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; }
      .print-container { width: 80%; margin: 160px auto 0; }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 8px; vertical-align: top; }
      .title { font-weight: bold; width: 40%; }
      .data { width: 60%; }
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
      '<tr><td class="title">Phone Number:</td><td class="data">' +
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
        new Date(record.dateTime).toLocaleString() +
        '</td></tr>'
    )
    printWindow.document.write('</table></div></body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  const printAllRecords = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    printWindow.document.write('<html><head><title>Print Records</title>')
    printWindow.document.write('<style>')
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 8px; border: 1px solid black; }
    `)
    printWindow.document.write('</style></head><body>')
    printWindow.document.write('<h2>Records</h2>')
    printWindow.document.write(
      '<table><thead><tr><th>S No.</th><th>Name</th><th>Phone Number</th><th>Address</th><th>City</th><th>State</th><th>Amount Received</th><th>Date & Time</th></tr></thead><tbody>'
    )

    filteredRecords.forEach((record, index) => {
      printWindow.document.write('<tr>')
      printWindow.document.write(`<td>${index + 1}</td>`)
      printWindow.document.write(`<td>${record.name}</td>`)
      printWindow.document.write(`<td>${record.phoneNumber}</td>`)
      printWindow.document.write(`<td>${record.address}</td>`)
      printWindow.document.write(`<td>${record.city}</td>`)
      printWindow.document.write(`<td>${record.state}</td>`)
      printWindow.document.write(`<td>${record.amountReceived}</td>`)
      printWindow.document.write(
        `<td>${new Date(record.dateTime).toLocaleString()}</td>`
      )
      printWindow.document.write('</tr>')
    })

    printWindow.document.write('</tbody></table></body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  const handleDownloadCSV = () => {
    try {
      const headers = [
        'S No.',
        'Name',
        'Phone Number',
        'Address',
        'City',
        'State',
        'Amount Received',
        'Date & Time',
      ]
      const csvContent = [
        headers.join(','), // CSV header row
        ...filteredRecords.map((record, index) =>
          [
            index + 1,
            record.name,
            record.phoneNumber,
            `"${record.address}"`, // Enclose address in double quotes
            record.city,
            record.state,
            record.amountReceived,
            `"${new Date(record.dateTime).toLocaleString()}"`, // Enclose date & time in double quotes
          ].join(',')
        ), // Each record in CSV format
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', 'records.csv')
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Revoke the object URL after use to free memory
    } catch (error) {
      console.error('Error generating CSV:', error)
    }
  }

  return (
    <div className="container">
      <p className="sub-heading">
        Donations received by: <span>{username}</span>
      </p>

      <SearchFilterContainer
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterAmount={filterAmount}
        setFilterAmount={setFilterAmount}
        filterType={filterType}
        setFilterType={setFilterType}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <table className="user-records-table" border="1">
        <thead>
          <tr>
            <th>S.No</th>
            <th onClick={() => handleSort('name')}>
              Name
              <LiaSortSolid />
            </th>
            <th onClick={() => handleSort('phoneNumber')}>
              Phone no <LiaSortSolid />
            </th>
            <th onClick={() => handleSort('address')}>
              Address <LiaSortSolid />
            </th>
            <th onClick={() => handleSort('city')}>
              City <LiaSortSolid />
            </th>
            <th onClick={() => handleSort('state')}>
              State <LiaSortSolid />
            </th>
            <th onClick={() => handleSort('amountReceived')}>
              Amount Received <LiaSortSolid />
            </th>
            <th onClick={() => handleSort('dateTime')}>
              Date & Time <LiaSortSolid />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={record._id}>
              <td>{index + 1}</td>
              <td>{record.name}</td>
              <td>{record.phoneNumber}</td>
              <td>{record.address}</td>
              <td>{record.city}</td>
              <td>{record.state}</td>
              <td>{record.amountReceived}</td>
              <td>{new Date(record.dateTime).toLocaleString()}</td>
              <td width={160}>
                <div className="action-btns">
                  <button
                    className="edit-btn btn"
                    onClick={() => handleEditClick(record)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn btn"
                    onClick={() => handleDelete(record._id)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    className="print-btn btn"
                    onClick={() => handlePrint(record)}
                  >
                    <IoMdPrint />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="total" colSpan="6">
              Total Amount Received:
            </td>
            <td className="totalno" colSpan="3">
              {userTotalAmount}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="download-container">
        <button className="download-btn" onClick={handleDownloadCSV}>
          Download
        </button>
        <button className="download-btn" onClick={printAllRecords}>
          Print Table
        </button>
      </div>

      {editingRecord && (
        <div className="popup-overlay">
          <div className="popup">
            <button
              className="popup-close-button"
              onClick={() => setEditingRecord(null)}
            >
              &times;
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
