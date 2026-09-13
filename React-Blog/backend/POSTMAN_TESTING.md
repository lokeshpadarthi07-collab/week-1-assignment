# 📮 Postman Testing Guide - React-Blog & Task Manager Backend (Port 5000)

All APIs (Auth, Task Manager CRUD, Multer Image Upload, Notes, Blog) run unified on **`http://localhost:5000`**.

---

## 🛠️ Base Configuration

- **Base URL**: `http://localhost:5000`
- **Content-Type**: `application/json` (except for `/api/upload` which uses `form-data`)

---

## 🔐 How to Send JWT Token in Postman

For protected endpoints (`GET /api/auth/me`, and all `/api/notes` routes):
1. Copy the `"token"` returned when registering (`POST /api/auth/register`) or logging in (`POST /api/auth/login`).
2. Go to Postman -> **Authorization** tab -> Set Type to **Bearer Token**.
3. Paste the JWT token into the **Token** field.

---

## 1️⃣ Multer Image Upload API (`/api/upload`)

### 1. Upload Single Image File (`POST /api/upload`)
- **URL**: `http://localhost:5000/api/upload`
- **Method**: `POST`
- **Body**: Select **form-data** (NOT raw JSON)
  - Key: `image` (Type: **File**) -> Click "Select Files" and choose any image file (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`).
- **Response**:
```json
{
  "success": true,
  "message": "Image uploaded successfully!",
  "data": {
    "filename": "img-1789271450563-70494674.png",
    "originalName": "avatar.png",
    "mimeType": "image/png",
    "size": 24500,
    "url": "/uploads/img-1789271450563-70494674.png",
    "fullUrl": "http://localhost:5000/uploads/img-1789271450563-70494674.png"
  }
}
```

---

## 2️⃣ User Authentication API (`/api/auth`)

### 2. User Registration (`POST /api/auth/register`)
- **URL**: `http://localhost:5000/api/auth/register`
- **Body**:
```json
{
  "name": "Lokesh Student",
  "email": "lokesh@example.com",
  "password": "securepassword123"
}
```

### 3. User Login (`POST /api/auth/login`)
- **URL**: `http://localhost:5000/api/auth/login`
- **Body**:
```json
{
  "email": "lokesh@example.com",
  "password": "securepassword123"
}
```

### 4. Get Authenticated User Profile (`GET /api/auth/me`)
- **URL**: `http://localhost:5000/api/auth/me`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`

---

## 3️⃣ Task Manager REST API (`/api/tasks`)

### 5. Create Task with Attachment (`POST /api/tasks`)
- **URL**: `http://localhost:5000/api/tasks`
- **Body**:
```json
{
  "title": "Build Task Manager Mini Project",
  "description": "Connect React frontend with Express REST API and MongoDB Mongoose",
  "priority": "high",
  "category": "Work",
  "dueDate": "2026-09-30",
  "imageUrl": "/uploads/img-1789271450563-70494674.png",
  "tags": ["React", "Express", "MongoDB", "Multer"]
}
```

### 6. Get Filtered Tasks (`GET /api/tasks`)
- **URL**: `http://localhost:5000/api/tasks?status=pending&priority=high&category=Work&search=React`
- **Query Parameters**:
  - `status`: `pending` or `completed`
  - `priority`: `high`, `medium`, or `low`
  - `category`: `Work`, `Personal`, `Study`, etc.
  - `search`: keyword string matching title, description, or tags

### 7. Update Task / Completion Toggle (`PUT /api/tasks/:id`)
- **URL**: `http://localhost:5000/api/tasks/<TASK_ID>`
- **Body**:
```json
{
  "completed": true
}
```

### 8. Delete Task (`DELETE /api/tasks/:id`)
- **URL**: `http://localhost:5000/api/tasks/<TASK_ID>`

---

## 4️⃣ Notes App Backend API (`/api/notes` - Protected)

### 9. Create Note (`POST /api/notes`)
- **URL**: `http://localhost:5000/api/notes`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`
- **Body**:
```json
{
  "title": "REST API Architecture",
  "content": "Unified backend with Express, MongoDB, Mongoose, JWT, bcrypt & Multer.",
  "category": "Backend"
}
```

### 10. Get My Notes (`GET /api/notes`)
- **URL**: `http://localhost:5000/api/notes`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`

### 11. Delete Note (`DELETE /api/notes/:id`)
- **URL**: `http://localhost:5000/api/notes/<NOTE_ID>`
- **Authorization**: `Bearer <YOUR_JWT_TOKEN>`
