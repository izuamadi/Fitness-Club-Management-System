import React, { useState, useEffect } from 'react'
import Header from './Header'
import { adminAPI } from '../services/api'

function AdminDashboard({ userId, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Data states
  const [admins, setAdmins] = useState([])
  const [rooms, setRooms] = useState([])
  const [equipment, setEquipment] = useState([])

  // Form states
  const [roomForm, setRoomForm] = useState({ room_name: '', capacity: '', location: '', admin_id: userId })
  const [equipmentForm, setEquipmentForm] = useState({ room_id: '', name: '', status: 'working' })
  const [classForm, setClassForm] = useState({
    class_name: '',
    trainer_id: '',
    room_id: '',
    start_time: '',
    end_time: '',
    capacity: ''
  })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'admins') {
        const res = await adminAPI.getAll()
        setAdmins(res.data)
      } else if (activeTab === 'rooms') {
        const res = await adminAPI.getRooms()
        setRooms(res.data)
      } else if (activeTab === 'equipment') {
        const res = await adminAPI.getEquipment()
        setEquipment(res.data)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.createRoom(roomForm)
      setSuccess('Room created successfully!')
      setRoomForm({ room_name: '', capacity: '', location: '', admin_id: userId })
      loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create room')
    }
  }

  const handleCreateEquipment = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.createEquipment(equipmentForm)
      setSuccess('Equipment created successfully!')
      setEquipmentForm({ room_id: '', name: '', status: 'working' })
      loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create equipment')
    }
  }

  const handleCreateClass = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...classForm,
        trainer_id: parseInt(classForm.trainer_id),
        room_id: parseInt(classForm.room_id),
        capacity: parseInt(classForm.capacity),
        start_time: new Date(classForm.start_time).toISOString(),
        end_time: new Date(classForm.end_time).toISOString()
      }
      await adminAPI.createClass(data)
      setSuccess('Group class created successfully!')
      setClassForm({ class_name: '', trainer_id: '', room_id: '', start_time: '', end_time: '', capacity: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create class')
    }
  }

  return (
    <>
      <Header userRole="admin" userId={userId} onLogout={onLogout} />
      <div className="container">
        <div className="nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`nav-tab ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              Rooms
            </button>
            <button
              className={`nav-tab ${activeTab === 'equipment' ? 'active' : ''}`}
              onClick={() => setActiveTab('equipment')}
            >
              Equipment
            </button>
            <button
              className={`nav-tab ${activeTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              Create Class
            </button>
            <button
              className={`nav-tab ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveTab('admins')}
            >
              Admins
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

        {activeTab === 'overview' && (
          <div className="card">
            <h2>Admin Dashboard</h2>
            <p>Welcome to the Admin Dashboard. Use the tabs above to manage different aspects of the fitness center.</p>
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e0f7f7', borderRadius: '4px' }}>
              <h3 style={{ color: '#008080', marginBottom: '10px' }}>Quick Actions:</h3>
              <ul style={{ lineHeight: '2' }}>
                <li>Create and manage rooms</li>
                <li>Add and track equipment</li>
                <li>Schedule group fitness classes</li>
                <li>Manage admin staff</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="card">
            <h2>Room Management</h2>
            <form onSubmit={handleCreateRoom} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                <div className="form-group">
                  <label>Room Name</label>
                  <input
                    type="text"
                    value={roomForm.room_name}
                    onChange={(e) => setRoomForm({ ...roomForm, room_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={roomForm.location}
                    onChange={(e) => setRoomForm({ ...roomForm, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create Room</button>
            </form>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : rooms.length === 0 ? (
              <div className="empty-state">
                <p>No rooms created yet</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Capacity</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.room_id}>
                      <td>{room.room_id}</td>
                      <td>{room.room_name}</td>
                      <td>{room.capacity}</td>
                      <td>{room.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="card">
            <h2>Equipment Management</h2>
            <form onSubmit={handleCreateEquipment} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                <div className="form-group">
                  <label>Room ID</label>
                  <input
                    type="number"
                    value={equipmentForm.room_id}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, room_id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Equipment Name</label>
                  <input
                    type="text"
                    value={equipmentForm.name}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={equipmentForm.status}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, status: e.target.value })}
                  >
                    <option value="working">Working</option>
                    <option value="broken">Broken</option>
                    <option value="in_repair">In Repair</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Add Equipment</button>
            </form>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : equipment.length === 0 ? (
              <div className="empty-state">
                <p>No equipment added yet</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Room ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item) => (
                    <tr key={item.equipment_id}>
                      <td>{item.equipment_id}</td>
                      <td>{item.name}</td>
                      <td>{item.room_id}</td>
                      <td>
                        <span style={{
                          color: item.status === 'working' ? 'green' : item.status === 'broken' ? 'red' : 'orange'
                        }}>
                          {item.status}
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
            <h2>Create Group Class</h2>
            <form onSubmit={handleCreateClass}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
                <div className="form-group">
                  <label>Class Name</label>
                  <input
                    type="text"
                    value={classForm.class_name}
                    onChange={(e) => setClassForm({ ...classForm, class_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Trainer ID</label>
                  <input
                    type="number"
                    value={classForm.trainer_id}
                    onChange={(e) => setClassForm({ ...classForm, trainer_id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Room ID</label>
                  <input
                    type="number"
                    value={classForm.room_id}
                    onChange={(e) => setClassForm({ ...classForm, room_id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={classForm.start_time}
                    onChange={(e) => setClassForm({ ...classForm, start_time: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={classForm.end_time}
                    onChange={(e) => setClassForm({ ...classForm, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create Class</button>
            </form>
            <div className="alert alert-info" style={{ marginTop: '20px' }}>
              <strong>Note:</strong> The system will check for room and trainer conflicts automatically. 
              If a room or trainer is already booked, you'll see an error message.
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="card">
            <h2>Admin Staff</h2>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : admins.length === 0 ? (
              <div className="empty-state">
                <p>No admins found</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.admin_id}>
                      <td>{admin.admin_id}</td>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.role || 'N/A'}</td>
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

export default AdminDashboard

