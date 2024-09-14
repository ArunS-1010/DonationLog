// src/App.js
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from '../src/pages/HomePage'
import SignupPage from '../src/pages/SignupPage'
import LoginPage from '../src/pages/LoginPage'
import MainPage from '../src/pages/MainPage'
import AdminPage from '../src/pages/AdminPage'
import AdminSignupPage from '../src/pages/AdminSignupPage'
import AdminLoginPage from '../src/pages/AdminLoginPage'
import PhoneNumberPage from '../src/pages/PhoneNumberPage'
import OtpVerificationPage from '../src/pages/OtpVerificationPage'
import AdminPhoneNumberPage from '../src/pages/AdminPhoneNumberPage'
import AdminOtpVerificationPage from '../src/pages/AdminOtpVerificationPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />

        <Route path="/admin/signup" element={<AdminSignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="/phone-number" element={<PhoneNumberPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />

        <Route path="/admin/phone-number" element={<AdminPhoneNumberPage />} />
        <Route
          path="/admin/verify-otp"
          element={<AdminOtpVerificationPage />}
        />
      </Routes>
    </Router>
  )
}

export default App
