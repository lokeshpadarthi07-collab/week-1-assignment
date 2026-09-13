# Full-Stack Internship Assignment Repository (Tasks & Mini Project)

A complete full-stack web development repository featuring the **Full Stack To-Do Application**, **Multer Image Upload Feature**, **Task Manager Application Mini Project**, **React Blog Platform**, and **Personal Portfolio Web App**.

---

## 🎯 Internship Assignment Features Matrix

| Assignment Task | Feature / Description | Stack / Technologies | Status |
| :--- | :--- | :--- | :--- |
| **1. Full Stack To-Do Application** | Connected Week 2 REST API with React frontend, JWT Authentication, full Task CRUD operations, and Client-Side Routing. | React 18, Vite, React Router v6, Express, MongoDB Mongoose, JWT, bcrypt | ✅ Complete |
| **2. Image Upload Feature** | Created Express file upload endpoint using Multer (`POST /api/upload`), live client-side image preview before upload, copy link, and media gallery. | Multer, Express Static, FormData API, React 18, Lucide Icons | ✅ Complete |
| **3. Mini Project: Task Manager** | Production-grade task tracking web app with user authentication, statistics dashboard, priority/category/status task filtering, and image attachments. | React 18, Express, MongoDB (Mongoose / Memory Fallback), JWT, CSS Glassmorphism | ✅ Complete |

---

## 📁 Repository Architecture

```text
Week1-Assignment/
│
├── Portfolio/                      # Week 1: Portfolio Web App
│   ├── frontend/                   # Static Frontend (HTML5, CSS3, Vanilla JS)
│   └── backend/                    # Express REST API (Contact form & Projects) - Port 5001
│
└── React-Blog/                     # Full Stack Task Manager, Image Upload & React Blog
    ├── frontend/                   # React 18 + Vite Frontend Client - Port 5173
    │   ├── src/
    │   │   ├── context/
    │   │   │   └── AuthContext.jsx # Auth state, JWT persistence & login/register handlers
    │   │   ├── components/
    │   │   │   ├── Navbar.jsx      # Top navigation header & theme switcher
    │   │   │   ├── TaskCard.jsx    # Task item card with completion toggle & attachment preview
    │   │   │   └── ImagePreview.jsx# Multer drag-and-drop picker & live client preview
    │   │   ├── pages/
    │   │   │   ├── TaskManager.jsx # Task Manager Mini Project App (CRUD + Filtering + Stats)
    │   │   │   ├── ImageUploadSandbox.jsx # Multer Image Upload & Gallery Showcase
    │   │   │   ├── BlogPage.jsx    # React Blog Platform
    │   │   │   ├── Login.jsx       # User Login Page
    │   │   │   └── Register.jsx    # User Registration Page
    │   │   ├── App.jsx             # React Router v6 routing setup
    │   │   └── App.css             # Glassmorphism design system & component styles
    │
    └── backend/                    # Express REST API (Auth + Tasks + Uploads + Notes) - Port 5000
        ├── config/
        │   └── db.js               # Mongoose MongoDB connection & dev fallback
        ├── controllers/
        │   ├── authController.js   # User Registration, Login & Auth Profile
        │   ├── taskController.js   # To-Do / Task Manager CRUD & filter queries
        │   └── uploadController.js # Multer image upload controller
        ├── middleware/
        │   ├── uploadMiddleware.js # Multer disk storage & image validation
        │   ├── authMiddleware.js   # JWT Authorization & optionalProtect middleware
        │   └── errorMiddleware.js  # Global Error Handling & 404 handler
        ├── models/
        │   ├── User.js             # Mongoose schema for User (bcrypt hashing)
        │   └── Task.js             # Enhanced Task schema (category, priority, dueDate, imageUrl, tags)
        ├── routes/
        │   ├── authRoutes.js       # Auth endpoints (/api/auth)
        │   ├── taskRoutes.js       # Task endpoints (/api/tasks)
        │   └── uploadRoutes.js     # Multer Upload endpoint (/api/upload)
        ├── uploads/                # Static directory serving Multer uploaded image files
        ├── scripts/
        │   └── test-api.js         # Automated verification test suite
        ├── server.js               # Main Express application entrypoint
        └── POSTMAN_TESTING.md      # Complete Postman testing guide
```

---

## 🌐 Live Demos

Week 1 Assignment
- 💼 **Portfolio Website:** `https://week-1-assignment-five.vercel.app`
- 📝 **React Blog App:** `https://week-1-assignment-ymzx-eight.vercel.app`

Week 2 Assignment
- 💼 **Portfolio Website:** `https://week-1-assignment-five.vercel.app`
- 📝 **React Blog App:** `https://week-1-assignment-kgj2.vercel.app/`

---

## 🚀 How to Run Locally

### 1. Backend REST API (Express + MongoDB + Multer)
```bash
cd React-Blog/backend
npm install
npm run dev
# Server runs at http://localhost:5000
```

### 2. Frontend Client (React 18 + Vite + React Router)
```bash
cd React-Blog/frontend
npm install
npm run dev
# Application runs at http://localhost:5173
```

### 3. Run Automated Backend Tests
```bash
cd React-Blog/backend
npm test
# Runs node scripts/test-api.js verifying Auth, Tasks, Notes, and Multer file upload endpoints
```

---

## 🌐 API Endpoint Summary

| Module | Method | Endpoint | Access / Auth | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Image Upload** | `POST` | `/api/upload` | Public | Upload image file via Multer (`multipart/form-data`, field: `image`) |
| **Authentication** | `POST` | `/api/auth/register` | Public | Register new user & hash password with bcrypt |
| **Authentication** | `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| **Authentication** | `GET` | `/api/auth/me` | Protected (JWT) | Get current logged-in user profile |
| **Task Manager** | `POST` | `/api/tasks` | Optional JWT | Create new task (title, description, priority, category, dueDate, imageUrl, tags) |
| **Task Manager** | `GET` | `/api/tasks` | Optional JWT | Retrieve tasks (Supports `?status=pending/completed&priority=high/medium/low&category=Work&search=kw`) |
| **Task Manager** | `GET` | `/api/tasks/:id` | Optional JWT | Retrieve single task by ID |
| **Task Manager** | `PUT` | `/api/tasks/:id` | Optional JWT | Update task details or toggle completion status |
| **Task Manager** | `DELETE` | `/api/tasks/:id` | Optional JWT | Delete task by ID |
| **Blog Posts** | `GET` | `/api/posts` | Public | Fetch all blog posts |

---

## 📮 Postman Testing

Refer to [POSTMAN_TESTING.md](file:///c:/Users/lokes/OneDrive/Desktop/Week1-Assignment/React-Blog/backend/POSTMAN_TESTING.md) for detailed Postman testing steps, sample `multipart/form-data` file upload requests, JSON payloads, and token authentication.
