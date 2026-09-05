# 📮 Postman Testing Guide - React-Blog Unified Backend (Port 5000)

All APIs (Week 1 Blog + Week 2 Auth, Tasks, Notes) are running unified on **`http://localhost:5000`**.

---

## 🛠️ Base Configuration

- **Base URL**: `http://localhost:5000`
- **Content-Type**: `application/json`

---

## 🔐 How to Send JWT Token in Postman

For protected endpoints (`GET /api/auth/me`, and all `/api/notes` routes):
1. Copy the `"token"` returned when registering (`POST /api/auth/register`) or logging in (`POST /api/auth/login`).
2. Go to Postman -> **Authorization** tab -> Set Type to **Bearer Token**.
3. Paste the JWT token into the **Token** field.

---

## 1️⃣ User Authentication API (`/api/auth`)

### 1. User Registration (`POST /api/auth/register`)
- **URL**: `http://localhost:5000/api/auth/register`
- **Body**:
```json
{
  "name": "Lokesh Student",
  "email": "lokesh@example.com",
  "password": "securepassword123"
}
```

### 2. User Login (`POST /api/auth/login`)
- **URL**: `http://localhost:5000/api/auth/login`
- **Body**:
```json
{
  "email": "lokesh@example.com",
  "password": "securepassword123"
}
```

### 3. Get Authenticated User Profile (`GET /api/auth/me`)
- **URL**: `http://localhost:5000/api/auth/me`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`

---

## 2️⃣ To-Do List REST API (`/api/tasks`)

### 4. Create Task (`POST /api/tasks`)
- **URL**: `http://localhost:5000/api/tasks`
- **Body**:
```json
{
  "title": "Study Node.js and Mongoose",
  "description": "Learn schema design and JWT auth.",
  "priority": "high"
}
```

### 5. Get All Tasks (`GET /api/tasks`)
- **URL**: `http://localhost:5000/api/tasks`

### 6. Update Task (`PUT /api/tasks/:id`)
- **URL**: `http://localhost:5000/api/tasks/<TASK_ID>`
- **Body**:
```json
{
  "completed": true
}
```

### 7. Delete Task (`DELETE /api/tasks/:id`)
- **URL**: `http://localhost:5000/api/tasks/<TASK_ID>`

---

## 3️⃣ Notes App Backend API (`/api/notes` - Protected)

### 8. Create Note (`POST /api/notes`)
- **URL**: `http://localhost:5000/api/notes`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`
- **Body**:
```json
{
  "title": "REST API Architecture",
  "content": "Unified React-Blog backend with Express, MongoDB, Mongoose, JWT & bcrypt.",
  "category": "Backend"
}
```

### 9. Get My Notes (`GET /api/notes`)
- **URL**: `http://localhost:5000/api/notes`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`

### 10. Get Single Note (`GET /api/notes/:id`)
- **URL**: `http://localhost:5000/api/notes/<NOTE_ID>`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`

### 11. Update Note (`PUT /api/notes/:id`)
- **URL**: `http://localhost:5000/api/notes/<NOTE_ID>`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`
- **Body**:
```json
{
  "title": "Updated Architecture Notes"
}
```

### 12. Delete Note (`DELETE /api/notes/:id`)
- **URL**: `http://localhost:5000/api/notes/<NOTE_ID>`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`
