// src/components/HomePage.js
import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Welcome to My App</h1>
      <button onClick={() => navigate('/signup')}>Signup</button>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  )
}

export default HomePage
