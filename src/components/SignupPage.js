// frontend/src/SignupPage.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
        setError(error.response.data.message) // Display error message if username exists
      } else {
        setError('Signup failed. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <div>
        <label>Username:</label>
        <input type="text" name="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" required />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input type="password" name="confirmPassword" required />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default SignupPage
