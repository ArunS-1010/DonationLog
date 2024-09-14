import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import '../styles/Records.css'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { IoMdPrint } from 'react-icons/io'
import { LiaSortSolid } from 'react-icons/lia'
import SearchFilterContainer from '../components/SearchFilterContainer'
import EditPopup from '../components/EditPopup'

const AdminPage = ({ username }) => {
  const [records, setRecords] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [editingRecord, setEditingRecord] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAmount, setFilterAmount] = useState('')
  const [filterType, setFilterType] = useState('greater')
  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const fetchRecords = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/records')
      const fetchedRecords = response.data
      const total = fetchedRecords.reduce(
        (sum, record) => sum + Number(record.amountReceived),
        0
      )
      setTotalAmount(total)
      setRecords(fetchedRecords)
    } catch (error) {
      console.error('Failed to fetch records:', error.message)
    }
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

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

    const printWindow = window.open('', '_blank', 'width=800,height=600')
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
      `<tr><td class="title">Name:</td><td class="data">${record.name}</td></tr>`
    )
    printWindow.document.write(
      `<tr><td class="title">Phone no:</td><td class="data">${record.phoneNumber}</td></tr>`
    )
    printWindow.document.write(
      `<tr><td class="title">Address:</td><td class="data">${record.address}</td></tr>`
    )
    printWindow.document.write(
      `<tr><td class="title">City:</td><td class="data">${record.city}</td></tr>`
    )
    printWindow.document.write(
      `<tr><td class="title">State:</td><td class="data">${record.state}</td></tr>`
    )
    printWindow.document.write(
      `<tr><td class="title">Amount Received:</td><td class="data">${record.amountReceived}</td></tr>`
    )
    printWindow.document.write(
      `<tr><td class="title">Date & Time:</td><td class="data">${formattedDate}</td></tr>`
    )
    printWindow.document.write('</table></div></body></html>')
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  // Function to handle printing the entire table
  const handlePrintTable = () => {
    const table = document.querySelector('.overall-records-table')
    if (!table) {
      console.error('Table element not found.')
      return
    }

    // Clone the existing table element and remove the "Actions" column
    const printTable = table.cloneNode(true)

    const headerCells = printTable.querySelectorAll('thead th')
    const actionIndex = Array.from(headerCells).findIndex(
      (cell) => cell.textContent.trim() === 'Actions'
    )

    if (actionIndex !== -1) {
      // Remove the "Actions" header cell
      headerCells[actionIndex]?.remove()

      // Remove all "Actions" cells in the table rows
      const bodyRows = printTable.querySelectorAll('tbody tr')
      bodyRows.forEach((row) => {
        const actionCell = row.children[actionIndex]
        if (actionCell) {
          actionCell.remove()
        }
      })
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Table</title>')
      printWindow.document.write('<style>')
      printWindow.document.write(`
        body {
          font-family: Arial, sans-serif;
        }
        .print-table-container {
          width: 100%;
          margin: 20px auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
      `)
      printWindow.document.write('</style></head><body>')
      printWindow.document.write('<div class="print-table-container">')
      printWindow.document.write(printTable.outerHTML)
      printWindow.document.write('</div></body></html>')
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    } else {
      console.error('Failed to open print window.')
    }
  }

  const generateCSV = () => {
    const headers = [
      'Name',
      'Phone Number',
      'Address',
      'City',
      'State',
      'Amount Received',
      'Received By',
      'Date & Time',
    ]
    const rows = filteredRecords.map((record) => [
      `"${record.name}"`,
      `"${record.phoneNumber}"`,
      `"${record.address}"`,
      `"${record.city}"`,
      `"${record.state}"`,
      `"${record.amountReceived}"`,
      `"${record.user.username}"`,
      `"${new Date(record.dateTime).toLocaleString()}"`,
    ])

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((row) => row.join(',')).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'records.csv')
    document.body.appendChild(link) // Required for Firefox
    link.click()
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const filteredRecords = records
    .filter((record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((record) => {
      const amount = Number(record.amountReceived)
      const filterValue = Number(filterAmount)

      if (filterType === 'greater') return amount > filterValue
      if (filterType === 'less') return amount < filterValue
      if (filterType === 'equals') return amount === filterValue
      return true
    })
    .sort((a, b) => {
      if (!sortColumn) return 0

      let aValue = a[sortColumn]
      let bValue = b[sortColumn]

      // Handle nested properties (like user.username)
      if (sortColumn === 'receivedBy') {
        aValue = a.user.username.toLowerCase()
        bValue = b.user.username.toLowerCase()
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      const comparison = aValue < bValue ? -1 : 1
      return sortOrder === 'asc' ? comparison : -comparison
    })

  return (
    <div className="container">
      <p className="admin">Admin</p>
      <p className="sub-heading2">Overall Records </p>
      <SearchFilterContainer
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterAmount={filterAmount}
        setFilterAmount={setFilterAmount}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      <table className="overall-records-table" border="1">
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
            <th onClick={() => handleSort('user.username')}>
              Received By <LiaSortSolid />
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
              <td>{record.user.username}</td>
              <td>
                {new Date(record.dateTime).toLocaleString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })}
              </td>
              <td width={150}>
                <div className="actions-btns">
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

          <tr>
            <td className="total" colSpan="6">
              Total Amount Received:
            </td>
            <td className="totalno" colSpan="4">
              {totalAmount}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="download-container">
        <button onClick={generateCSV} className="download-btn">
          Download
        </button>
        <button onClick={handlePrintTable} className="download-btn">
          Print Table
        </button>
      </div>
      {editingRecord && (
        <EditPopup
          editingRecord={editingRecord}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
          setEditingRecord={setEditingRecord}
          closeEditPopup={() => setEditingRecord(null)}
        />
      )}
    </div>
  )
}

export default AdminPage
