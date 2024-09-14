import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

const SignupPage = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSignup = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    const confirmPassword = event.target.confirmPassword.value

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        password,
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
    <div className="login-container">
      <form onSubmit={handleSignup}>
        <div className="form-content">
          <h2>User Signup</h2>
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
          {error && <p className="error-message">{error}</p>}{' '}
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
