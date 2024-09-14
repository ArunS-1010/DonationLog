import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="home-contents">
        <h1 className="heading">WELCOME!</h1>
        <div className="user_admin_cards">
          <div className="user-container">
            <h3 className="card_title">User</h3>
            <button className="login_button" onClick={() => navigate('/otp')}>
              Signup
            </button>
            <button className="login_button" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
          <div className="admin-container">
            <h3 className="card_title">Admin</h3>
            <button
              className="login_button"
              onClick={() => navigate('/otp-admin')}
            >
              Signup
            </button>
            <button
              className="login_button"
              onClick={() => navigate('/admin/login')}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
