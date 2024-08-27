import React, { useState, useEffect } from 'react'
import FormPage from './FormPage'
import Records from './Records'
import './MainPage.css'

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('form')
  const [username, setUsername] = useState('')

  useEffect(() => {
    // Fetch the username from localStorage or another source
    const storedUsername = localStorage.getItem('username')
    setUsername(storedUsername)
  }, [])

  return (
    <div className="container">
      <div className="header">
        {/* <h1>Main Page</h1>
        <div className="username-display">User: {username}</div> */}
        <div className="username-display">
          <p className="username">
            {/* <UserIcon /> */}
            Username: <span>{username}</span>
          </p>
        </div>
      </div>
      <div className="tab-btn">
        <button
          className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Form
        </button>
        <button
          className={`tab-button ${activeTab === 'record' ? 'active' : ''}`}
          onClick={() => setActiveTab('record')}
        >
          Records
        </button>
      </div>
      <div>
        {activeTab === 'form' ? <FormPage /> : <Records username={username} />}
      </div>
    </div>
  )
}

export default MainPage
