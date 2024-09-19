import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/otppage.css'

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const sendOtp = async () => {
    try {
      const response = await axios.post('https://donationlog-backend.onrender.com/send-otp', {
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
      const response = await axios.post('https://donationlog-backend.onrender.com/verify-otp', {
        otp,
      })
      if (response.data.message === 'OTP verified successfully') {
        navigate('/signup', { state: { email } })
      } else {
        setMessage('Invalid OTP')
      }
    } catch (error) {
      setMessage('Invalid OTP')
    }
  }

  return (
    <div className="otppage">
      <h3>User Signup</h3>
      {!isOtpSent ? (
        <div className="otppage-content">
          <h2>Enter your Email for OTP verification</h2>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Handle change
              placeholder="Email"
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
            value={otp}
            onChange={(e) => setOtp(e.target.value)} // Handle change
            placeholder="OTP"
          />
          <div className="otp-btn">
            <button onClick={verifyOtp}>Verify OTP</button>
          </div>
        </div>
      )}
      <div className="otp-message">{message && <p>{message}</p>}</div>
    </div>
  )
}

export default SignupPage
