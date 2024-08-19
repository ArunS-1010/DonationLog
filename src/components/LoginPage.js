// frontend/src/LoginPage.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      })
      console.log(response.data) // Handle successful login
      navigate('/main') // Redirect to main page after successful login
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message)
      } else {
        setError('Login failed. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username:</label>
        <input type="text" name="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" required />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginPage
