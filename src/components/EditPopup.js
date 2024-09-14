// EditPopup - component
import React from 'react'
import '../styles/Records.css'

const EditPopup = ({
  editingRecord,
  handleEditChange,
  handleEditSubmit,
  closeEditPopup,
}) => {
  if (!editingRecord) {
    return null
  }

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="popup-close-button" onClick={closeEditPopup}>
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
  )
}

export default EditPopup
