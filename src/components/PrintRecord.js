// PrintRecord.js
import React from 'react'

const PrintRecord = ({ record }) => {
  const handlePrint = () => {
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
    printWindow.document.write('</table>')
    printWindow.document.write('</div>')
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <button className="print-btn btn" onClick={handlePrint}>
      Print
    </button>
  )
}

export default PrintRecord
