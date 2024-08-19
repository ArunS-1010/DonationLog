// src/components/MainPage.js
import React, { useState } from 'react'
import FormPage from './FormPage'
import Records from './Records'

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('form')

  return (
    <div>
      <h1>Main Page</h1>
      <div>
        <button onClick={() => setActiveTab('form')}>Form</button>
        <button onClick={() => setActiveTab('records')}>Records</button>
      </div>
      <div>{activeTab === 'form' ? <FormPage /> : <Records />}</div>
    </div>
  )
}

export default MainPage
