import React, { useState } from 'react'
import { memberAPI, adminAPI, trainerAPI } from '../services/api'

function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setError('')
  }

  const handleLogin = async () => {
    if (!selectedRole || !userId) {
      setError('Please select a role and enter an ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      let response
      const id = parseInt(userId)

      switch (selectedRole) {
        case 'member':
          response = await memberAPI.getById(id)
          break
        case 'admin':
          response = await adminAPI.getById(id)
          break
        case 'trainer':
          response = await trainerAPI.getById(id)
          break
        default:
          throw new Error('Invalid role')
      }

      if (response.data) {
        onLogin(selectedRole, id)
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} with ID ${userId} not found. Please create one first or use an existing ID.`)
      } else {
        setError('Failed to login. Please check your backend is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Fitness Center Management</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Select your role and enter your ID to continue
        </p>

        <div className="role-selector">
          <div
            className={`role-button ${selectedRole === 'member' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('member')}
          >
            <h3>Member</h3>
            <p>View classes, track health</p>
          </div>
          <div
            className={`role-button ${selectedRole === 'admin' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('admin')}
          >
            <h3>Admin</h3>
            <p>Manage system</p>
          </div>
          <div
            className={`role-button ${selectedRole === 'trainer' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('trainer')}
          >
            <h3>Trainer</h3>
            <p>Set availability</p>
          </div>
        </div>

        {selectedRole && (
          <div className="form-group">
            <label>
              {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} ID:
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={`Enter ${selectedRole} ID`}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={!selectedRole || !userId || loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
          Tip: Use Swagger docs to create users first, then login with their IDs
        </p>
      </div>
    </div>
  )
}

export default Login

