import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminEmailPage = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const sendOTP = async () => {
    try {
      await axios.post('/admin/send-otp', { email })
      alert('Admin OTP sent to your email')
      navigate('/admin/verify-otp', { state: { email } }) // Navigate to Admin OTP verification page
    } catch (error) {
      alert('Failed to send Admin OTP')
    }
  }

  return (
    <div>
      <h2>Admin Email Verification</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendOTP}>Send OTP</button>
    </div>
  )
}

export default AdminEmailPage
