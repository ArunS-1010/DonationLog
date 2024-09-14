// src/pages/SignupPage.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/Login.css'

const SignupPage = () => {
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get email from the navigation state
    const emailFromState = location.state?.email
    if (emailFromState) {
      setEmail(emailFromState)
    }
  }, [location.state?.email])

  const handleSignup = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    const confirmPassword = event.target.confirmPassword.value
    const phoneNumber = event.target.phoneNumber.value

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        password,
        email, // Use the email from state
        phoneNumber,
      })
      console.log(response.data) // Handle successful signup
      navigate('/login') // Redirect to login page after successful signup
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Display error message if username already exists
        setError('Username already exists. Please choose another username.')
      } else {
        setError('Signup failed. Please try again.')
      }
    }
  }

  return (
    <div className="login-container signup-container">
      <form onSubmit={handleSignup}>
        <div className="form-content">
          <h2>User Signup</h2>
          <div className="title">
            <label>Email:</label>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={email} // Set value from state
              required
            />
          </div>
          <div className="title">
            <label>Phone Number:</label>
          </div>
          <div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              required
            />
          </div>
          <div className="title">
            <label>Username:</label>
          </div>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="title">
            <label>Password:</label>
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="title">
            <label>Confirm Password:</label>
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {/* Error message */}
          <button className="signupbtn" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignupPage
