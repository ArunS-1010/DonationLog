import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const EmailVerifyPage = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const sendOTP = async () => {
    try {
      await axios.post('http://localhost:5000/send-otp', { email })
      setIsOtpSent(true)
      setMessage('OTP sent to your email')
    } catch (error) {
      console.error('Error sending OTP:', error.message)
      if (error.code === 'ECONNREFUSED') {
        setMessage(
          'Connection refused. Ensure the mail server is running and configured correctly.'
        )
      } else {
        setMessage(
          'Failed to send OTP. Please check your server configuration.'
        )
      }
    }
  }

  const verifyOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', {
        email,
        otp,
      })
      setMessage(response.data.message)
      if (response.data.success) {
        navigate('/signup') // Redirect to signup page upon successful verification
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setMessage('Invalid OTP')
    }
  }

  return (
    <div className="EmailVerifyPage">
      {!isOtpSent ? (
        <div>
          <h2>Email Verification</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </div>
      ) : (
        <div>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  )
}

export default EmailVerifyPage
