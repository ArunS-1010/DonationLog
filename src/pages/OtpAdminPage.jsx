// src/pages/OtpAdminPage.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const OtpAdminPage = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-otp', {
        email,
      })
      setIsOtpSent(true)
      setMessage(response.data.message)
    } catch (error) {
      setMessage('Failed to send OTP')
    }
  }

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', {
        otp,
      })
      console.log('OTP Response:', response.data) // Debug: Log the response
      if (response.data.message === 'OTP verified successfully') {
        // Redirect to /admin/signup with the email state
        navigate('/admin/signup', { state: { email } })
      } else {
        // Show error message if OTP verification fails
        setMessage('Invalid OTP')
      }
    } catch (error) {
      console.error('OTP Verification Error:', error) // Debug: Log errors
      setMessage('Invalid OTP') // Show an error if there's a network issue or server error
    }
  }

  return (
    <div className="otppage">
      <h3>Admin Signup</h3>
      {!isOtpSent ? (
        <div className="otppage-content">
          <h2>Enter your Email for OTP verification </h2>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="otp-btn">
            <button onClick={sendOtp}>Send OTP</button>
          </div>
        </div>
      ) : (
        <div className="otppage-content">
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="otp-btn">
            <button onClick={verifyOtp}>Verify OTP</button>
          </div>{' '}
        </div>
      )}
      <div className="otp-message">{message && <p>{message}</p>}</div>
    </div>
  )
}

export default OtpAdminPage
