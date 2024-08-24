import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('') // State for storing error message
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      })
      const { token } = response.data

      // Store the token in localStorage or state
      localStorage.setItem('token', token)
      localStorage.setItem('username', username) // Store the username for later use

      // Redirect to the main page
      navigate('/main')
    } catch (error) {
      setErrorMessage('Invalid username or password. Please try again.') // Set the error message
      console.error(
        'Login failed:',
        error.response ? error.response.data : error.message
      )
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div className="form-content">
          <div className="title">
            <label>Username: </label>
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="title">
            <label>Password: </label>
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}{' '}
          {/* Error message */}
          <button className="loginbtn" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
