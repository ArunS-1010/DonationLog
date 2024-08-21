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
    <div>
      <div className="header">
        <h1>Main Page</h1>
        <div className="username-display">{username}</div>
      </div>
      <div className="tab-btn">
        <button onClick={() => setActiveTab('form')}>Form</button>
        <button onClick={() => setActiveTab('records')}>Records</button>
      </div>
      <div>
        {activeTab === 'form' ? <FormPage /> : <Records username={username} />}
      </div>
    </div>
  )
}

export default MainPage
