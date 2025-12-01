import React, { useState, useEffect } from 'react'
import Header from './Header'
import { memberAPI } from '../services/api'

function MemberDashboard({ userId, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [member, setMember] = useState(null)
  const [healthMetrics, setHealthMetrics] = useState([])
  const [fitnessGoals, setFitnessGoals] = useState([])
  const [classRegistrations, setClassRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [healthMetricForm, setHealthMetricForm] = useState({ weight: '', heart_rate: '', body_fat: '' })
  const [fitnessGoalForm, setFitnessGoalForm] = useState({ goal_type: '', target_value: '', current_value: '', target_date: '' })
  const [classId, setClassId] = useState('')

  useEffect(() => {
    loadData()
  }, [userId, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      const memberRes = await memberAPI.getById(userId)
      setMember(memberRes.data)

      if (activeTab === 'health') {
        const metricsRes = await memberAPI.getHealthMetrics(userId)
        setHealthMetrics(metricsRes.data)
      } else if (activeTab === 'goals') {
        const goalsRes = await memberAPI.getFitnessGoals(userId)
        setFitnessGoals(goalsRes.data)
      } else if (activeTab === 'classes') {
        const regRes = await memberAPI.getClassRegistrations(userId)
        setClassRegistrations(regRes.data)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddHealthMetric = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await memberAPI.createHealthMetric(userId, healthMetricForm)
      setSuccess('Health metric recorded successfully!')
      setHealthMetricForm({ weight: '', heart_rate: '', body_fat: '' })
      loadData()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to record health metric'
      setError(errorMsg)
      setSuccess('')
    }
  }

  const handleAddFitnessGoal = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await memberAPI.createFitnessGoal(userId, fitnessGoalForm)
      setSuccess('Fitness goal created successfully!')
      setFitnessGoalForm({ goal_type: '', target_value: '', current_value: '', target_date: '' })
      loadData()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to create fitness goal'
      setError(errorMsg)
      setSuccess('')
    }
  }

  const handleRegisterForClass = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await memberAPI.registerForClass(userId, parseInt(classId))
      setSuccess('Successfully registered for class!')
      setClassId('')
      loadData()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to register for class'
      setError(errorMsg)
      setSuccess('')
    }
  }

  const handleCancelRegistration = async (classId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      setError('')
      setSuccess('')
      try {
        await memberAPI.cancelRegistration(userId, classId)
        setSuccess('Registration cancelled successfully!')
        loadData()
      } catch (err) {
        const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to cancel registration'
        setError(errorMsg)
        setSuccess('')
      }
    }
  }

  if (loading && !member) {
    return (
      <>
        <Header userRole="member" userId={userId} onLogout={onLogout} />
        <div className="loading">Loading...</div>
      </>
    )
  }

  return (
    <>
      <Header userRole="member" userId={userId} onLogout={onLogout} />
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
              className={`nav-tab ${activeTab === 'health' ? 'active' : ''}`}
              onClick={() => setActiveTab('health')}
            >
              Health Metrics
            </button>
            <button
              className={`nav-tab ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              Fitness Goals
            </button>
            <button
              className={`nav-tab ${activeTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              My Classes
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ cursor: 'pointer', fontWeight: '500' }} onClick={() => setError('')}>
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ cursor: 'pointer' }} onClick={() => setSuccess('')}>
            {success}
          </div>
        )}

        {activeTab === 'profile' && member && (
          <div className="card">
            <h2>Member Profile</h2>
            <table className="table">
              <tbody>
                <tr><td><strong>ID:</strong></td><td>{member.member_id}</td></tr>
                <tr><td><strong>Name:</strong></td><td>{member.name}</td></tr>
                <tr><td><strong>Email:</strong></td><td>{member.email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>{member.phone || 'N/A'}</td></tr>
                <tr><td><strong>Gender:</strong></td><td>{member.gender || 'N/A'}</td></tr>
                <tr><td><strong>Date of Birth:</strong></td><td>{member.date_of_birth || 'N/A'}</td></tr>
                <tr><td><strong>Member Since:</strong></td><td>{member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="card">
            <h2>Health Metrics</h2>
            <form onSubmit={handleAddHealthMetric} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={healthMetricForm.weight}
                    onChange={(e) => setHealthMetricForm({ ...healthMetricForm, weight: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={healthMetricForm.heart_rate}
                    onChange={(e) => setHealthMetricForm({ ...healthMetricForm, heart_rate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={healthMetricForm.body_fat}
                    onChange={(e) => setHealthMetricForm({ ...healthMetricForm, body_fat: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Record Metric</button>
            </form>

            {healthMetrics.length === 0 ? (
              <div className="empty-state">
                <p>No health metrics recorded yet</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight (kg)</th>
                    <th>Heart Rate (bpm)</th>
                    <th>Body Fat (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {healthMetrics.map((metric) => (
                    <tr key={metric.metric_id}>
                      <td>{new Date(metric.recorded_at).toLocaleString()}</td>
                      <td>{metric.weight || 'N/A'}</td>
                      <td>{metric.heart_rate || 'N/A'}</td>
                      <td>{metric.body_fat || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="card">
            <h2>Fitness Goals</h2>
            <form onSubmit={handleAddFitnessGoal} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
                <div className="form-group">
                  <label>Goal Type</label>
                  <input
                    type="text"
                    value={fitnessGoalForm.goal_type}
                    onChange={(e) => setFitnessGoalForm({ ...fitnessGoalForm, goal_type: e.target.value })}
                    placeholder="e.g., weight_loss, muscle_gain"
                  />
                </div>
                <div className="form-group">
                  <label>Target Date</label>
                  <input
                    type="date"
                    value={fitnessGoalForm.target_date}
                    onChange={(e) => setFitnessGoalForm({ ...fitnessGoalForm, target_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Target Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fitnessGoalForm.target_value}
                    onChange={(e) => setFitnessGoalForm({ ...fitnessGoalForm, target_value: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Current Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fitnessGoalForm.current_value}
                    onChange={(e) => setFitnessGoalForm({ ...fitnessGoalForm, current_value: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create Goal</button>
            </form>

            {fitnessGoals.length === 0 ? (
              <div className="empty-state">
                <p>No fitness goals set yet</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Goal Type</th>
                    <th>Target Value</th>
                    <th>Current Value</th>
                    <th>Target Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fitnessGoals.map((goal) => (
                    <tr key={goal.goal_id}>
                      <td>{goal.goal_type}</td>
                      <td>{goal.target_value || 'N/A'}</td>
                      <td>{goal.current_value || 'N/A'}</td>
                      <td>{goal.target_date || 'N/A'}</td>
                      <td>
                        <span style={{ color: goal.is_active ? 'green' : 'gray' }}>
                          {goal.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="card">
            <h2>Class Registrations</h2>
            <form onSubmit={handleRegisterForClass} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Class ID</label>
                  <input
                    type="number"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    placeholder="Enter class ID to register"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Register for Class</button>
              </div>
            </form>

            {classRegistrations.length === 0 ? (
              <div className="empty-state">
                <p>No class registrations yet</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Registration ID</th>
                    <th>Class ID</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classRegistrations.map((reg) => (
                    <tr key={reg.registration_id}>
                      <td>{reg.registration_id}</td>
                      <td>{reg.class_id}</td>
                      <td>{new Date(reg.registered_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelRegistration(reg.class_id)}
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
                          Cancel
                        </button>
                      </td>
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

export default MemberDashboard

