import React, { useState, useEffect } from 'react'
import Header from './Header'
import { trainerAPI } from '../services/api'

function TrainerDashboard({ userId, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [trainer, setTrainer] = useState(null)
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [availabilityForm, setAvailabilityForm] = useState({ start_time: '', end_time: '' })

  useEffect(() => {
    loadData()
  }, [userId, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      const trainerRes = await trainerAPI.getById(userId)
      setTrainer(trainerRes.data)

      if (activeTab === 'availability') {
        const availRes = await trainerAPI.getAvailability(userId)
        setAvailability(availRes.data)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAvailability = async (e) => {
    e.preventDefault()
    try {
      const data = {
        start_time: new Date(availabilityForm.start_time).toISOString(),
        end_time: new Date(availabilityForm.end_time).toISOString()
      }
      await trainerAPI.addAvailability(userId, data)
      setSuccess('Availability added successfully!')
      setAvailabilityForm({ start_time: '', end_time: '' })
      loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add availability')
    }
  }

  if (loading && !trainer) {
    return (
      <>
        <Header userRole="trainer" userId={userId} onLogout={onLogout} />
        <div className="loading">Loading...</div>
      </>
    )
  }

  return (
    <>
      <Header userRole="trainer" userId={userId} onLogout={onLogout} />
      <div className="container">
        <div className="nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`nav-tab ${activeTab === 'availability' ? 'active' : ''}`}
              onClick={() => setActiveTab('availability')}
            >
              Availability
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" onClick={() => setError('')}>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" onClick={() => setSuccess('')}>
            {success}
          </div>
        )}

        {activeTab === 'profile' && trainer && (
          <div className="card">
            <h2>Trainer Profile</h2>
            <table className="table">
              <tbody>
                <tr><td><strong>ID:</strong></td><td>{trainer.trainer_id}</td></tr>
                <tr><td><strong>Name:</strong></td><td>{trainer.name}</td></tr>
                <tr><td><strong>Email:</strong></td><td>{trainer.email}</td></tr>
                <tr><td><strong>Specialization:</strong></td><td>{trainer.specialization || 'N/A'}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>{trainer.phone || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="card">
            <h2>Set Availability</h2>
            <form onSubmit={handleAddAvailability} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={availabilityForm.start_time}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, start_time: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={availabilityForm.end_time}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Add Availability</button>
            </form>

            {availability.length === 0 ? (
              <div className="empty-state">
                <p>No availability slots set yet</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {availability.map((slot) => (
                    <tr key={slot.availability_id}>
                      <td>{new Date(slot.start_time).toLocaleString()}</td>
                      <td>{new Date(slot.end_time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default TrainerDashboard

