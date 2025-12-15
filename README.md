# Fitness Center Management System

A backend-focused fitness center management application built with FastAPI, PostgreSQL, SQLAlchemy, and a React frontend. The system provides a clean, modular API for managing members, trainers, administrators, classes, equipment, and facilities.

Project Demo: [https://youtu.be/C0WzHhe5Iuw](https://youtu.be/C0WzHhe5Iuw)

---

## Overview

This application supports the core operations of a fitness center using role-based access and clearly separated responsibilities. The backend is designed to be maintainable, scalable, and easy to extend, with strong validation and structured database models.

---

## Architecture

* Backend: FastAPI (ASGI)
* Database: PostgreSQL
* ORM: SQLAlchemy
* Validation: Pydantic
* Frontend: React

Each feature area is implemented as a separate module with its own models, schemas, and routes.

---

## User Roles

### Members

* Create and manage profiles
* Register for group classes
* Track health metrics (weight, body fat, heart rate)
* Set personal fitness goals

### Trainers

* Manage trainer profiles
* Define availability schedules
* Conduct personal training sessions

### Administrators

* Manage rooms and facility spaces
* Track and maintain equipment
* Create and schedule classes
* Record and resolve maintenance issues

---

## Core Features

* Full CRUD operations for all resources
* Role-based API design
* Centralized routing
* ORM-based database modeling
* Strong request and response validation

---

## Technology Stack

* Python 3.10+
* FastAPI
* PostgreSQL
* SQLAlchemy
* Pydantic
* Uvicorn
* React

---

## Setup

Clone the repository:

```bash
git clone <repository-url>
cd fitness-center-management-system
```

Create a virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file from the template and add your PostgreSQL credentials.

---

## Database

Create the database using pgAdmin or psql:

```sql
CREATE DATABASE fitness_center_db_group;
```

Tables are created automatically at startup if `Base.metadata.create_all(engine)` is enabled.

---

## Running the Application

Backend:

```bash
uvicorn main:app --reload
```

API available at:
[http://localhost:8000](http://localhost:8000)

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend available at:
[http://localhost:3000](http://localhost:3000)

---

## API Documentation

Swagger documentation is available at:
[http://localhost:8000/docs](http://localhost:8000/docs)

---
