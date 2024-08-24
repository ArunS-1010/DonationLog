// src/components/HomePage.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="home-contents">
        <h1>WELCOME! </h1>
        <div>
          <button onClick={() => navigate('/signup')}>Signup</button>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
