# Fitness Center Frontend

Simple React frontend for the Fitness Center Management System.

## Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Frontend: http://localhost:3000
   - Make sure backend is running on http://127.0.0.1:8000

## Usage

1. **Login Flow:**
   - Select a role (Member, Admin, or Trainer)
   - Enter the ID of an existing user
   - Click "Login"

2. **Note:** You need to create users first using the Swagger docs at http://127.0.0.1:8000/docs, then login with their IDs.

## Features

- **Member Dashboard:**
  - View profile
  - Record health metrics
  - Set fitness goals
  - Register for classes
  - View class registrations

- **Admin Dashboard:**
  - Create and manage rooms
  - Add equipment
  - Create group classes (with conflict checking)
  - View admin staff

- **Trainer Dashboard:**
  - View profile
  - Set availability slots

## Design

- Teal-based color scheme (#008080)
- Clean, simple interface
- Role-based navigation
- Error and success message handling

