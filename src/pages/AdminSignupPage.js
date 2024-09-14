// src/pages/AdminSignupPage.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

const AdminSignupPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get email from the navigation state
    const emailFromState = location.state?.email
    if (emailFromState) {
      setEmail(emailFromState)
    }
  }, [location.state?.email])

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      await axios.post('http://localhost:5000/admin/signup', {
        username,
        password,
        email, // Use the email from state
        phoneNumber,
      })
      alert('Admin created successfully')
      navigate('/admin/login')
    } catch (error) {
      console.error(
        'Signup failed:',
        error.response ? error.response.data : error.message
      )
      alert('Failed to create admin')
    }
  }

  return (
    <div className="login-container signup-container">
      <form onSubmit={handleSignup}>
        <div className="form-content">
          <h2>Admin Signup</h2>

          <div className="title">
            <label>Email:</label>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="title">
            <label>Phone Number:</label>
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="title">
            <label>Admin Username:</label>
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="title">
            <label>Password:</label>
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="title">
            <label>Confirm Password:</label>
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="signupbtn" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSignupPage
