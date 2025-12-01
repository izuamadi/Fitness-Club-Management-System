# Frontend Setup Guide

## Quick Start

### 1. Install Node.js
Make sure you have Node.js installed (version 16+ recommended).

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will start on: **http://localhost:3000**

### 4. Make Sure Backend is Running

In a separate terminal, start your FastAPI backend:

```bash
# From project root
uvicorn main:app --reload
```

Backend should be on: **http://127.0.0.1:8000**

## Using the Frontend

### Login Flow

1. **Open:** http://localhost:3000
2. **Select a role:** Member, Admin, or Trainer
3. **Enter ID:** Use an ID from your database
   - **Tip:** Create users first using Swagger (http://127.0.0.1:8000/docs)
   - Then login with their IDs

### Member Features

- **Profile:** View member information
- **Health Metrics:** Record weight, heart rate, body fat
- **Fitness Goals:** Create and track fitness goals
- **My Classes:** Register for classes and view registrations

### Admin Features

- **Rooms:** Create and manage rooms
- **Equipment:** Add equipment to rooms
- **Create Class:** Schedule group fitness classes (shows conflict errors)
- **Admins:** View admin staff list

### Trainer Features

- **Profile:** View trainer information
- **Availability:** Set time slots when available

## Demonstrating Edge Cases

### Success Cases:
1. Create a member → Login as member → View profile
2. Record health metric → See it in the list
3. Register for class → See registration

### Failure Cases:
1. **Duplicate Registration:**
   - Register for a class twice → See error: "Member is already registered for this class"

2. **Class at Capacity:**
   - Fill a class to capacity → Try registering another member → See error: "Class is at full capacity"

3. **Room Conflict:**
   - Create a class in Room 1 at 10:00-11:00
   - Try creating another class in Room 1 at 10:30-11:30 → See error: "Room is already booked"

4. **Trainer Conflict:**
   - Create a class with Trainer 1 at 10:00-11:00
   - Try creating another class with Trainer 1 at 10:30-11:30 → See error: "Trainer is already teaching another class"

5. **Invalid ID:**
   - Try logging in with non-existent ID → See error message

## For Your Video Demo

1. **Show Login Flow:**
   - Select role → Enter ID → Login
   - Navigate between tabs

2. **Show Success Cases:**
   - Create/View data in each role
   - Show data appearing in tables

3. **Show Failure Cases:**
   - Try duplicate operations
   - Show error messages appearing
   - Explain the validation

4. **Show Navigation:**
   - Switch between Member/Admin/Trainer views
   - Show role-specific features

## Troubleshooting

- **CORS Errors:** Make sure backend has CORS enabled (already added to main.py)
- **Connection Errors:** Verify backend is running on port 8000
- **404 Errors:** Make sure you've created users in the database first

