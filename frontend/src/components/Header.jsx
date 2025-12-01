import React from 'react'

function Header({ userRole, userId, onLogout }) {
  const roleNames = {
    member: 'Member',
    admin: 'Admin',
    trainer: 'Trainer'
  }

  return (
    <div className="header">
      <div className="header-content">
        <h1>Fitness Center Management System</h1>
        <div className="header-actions">
          <span className="user-info">
            {roleNames[userRole]} #{userId}
          </span>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header

