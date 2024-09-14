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
// import OtpVerificationPage from '../src/pages/OtpVerificationPage'
// import AdminOtpVerificationPage from '../src/pages/AdminOtpVerificationPage'
import EmailVerifyPage from '../src/pages/EmailVerifyPage'
import AdminEmailPage from '../src/pages/AdminEmailPage'
import OtpPage from './pages/OtpPage'
import OtpAdminPage from './pages/OtpAdminPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        {/* <Route path="/verify-otp" element={<OtpVerificationPage />} /> */}
        {/* <Route
          path="/admin/verify-otp"
          element={<AdminOtpVerificationPage />}
        /> */}
        <Route path="/email-verify" element={<EmailVerifyPage />} />
        <Route path="/admin-email" element={<AdminEmailPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/otp-admin" element={<OtpAdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
