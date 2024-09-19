import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('https://donationlog-backend.onrender.com/admin/login', {
        username,
        password,
      })
      if (response.data.success) {
        // Save the token and navigate to the Admin Page
        localStorage.setItem('adminToken', response.data.token)
        navigate('/admin')
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error(
        'Login failed:',
        error.response ? error.response.data : error.message
      )
      alert(
        'Failed to login: ' +
          (error.response ? error.response.data.error : error.message)
      )
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div className="form-content">
          <h2>Admin Login</h2>
          <div className="title">
            <label>Admin Username: </label>
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
            <label>Password: </label>
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
          <button className="loginbtn" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminLoginPage
