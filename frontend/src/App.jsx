import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import MemberDashboard from './components/MemberDashboard'
import AdminDashboard from './components/AdminDashboard'
import TrainerDashboard from './components/TrainerDashboard'
import './App.css'

function App() {
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)

  const handleLogin = (role, id) => {
    setUserRole(role)
    setUserId(id)
  }

  const handleLogout = () => {
    setUserRole(null)
    setUserId(null)
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={
              userRole ? <Navigate to={`/${userRole}`} /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/member" 
            element={
              userRole === 'member' ? 
              <MemberDashboard userId={userId} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              userRole === 'admin' ? 
              <AdminDashboard userId={userId} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/trainer" 
            element={
              userRole === 'trainer' ? 
              <TrainerDashboard userId={userId} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

