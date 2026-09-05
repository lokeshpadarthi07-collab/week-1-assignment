# Full-Stack Assignment Repository (Week 1 & Week 2)

A full-stack web development repository containing a **personal portfolio website**, a **React blog application**, and the **Week 2 Backend Development REST APIs** (User Authentication with bcrypt & JWT, To-Do List REST API, and Notes App Backend API).

---

## 📁 Repository Architecture

```text
Week1-Assignment/
│
├── Portfolio/                      # Week 1: Portfolio Web App
│   ├── frontend/                   # Static Frontend (HTML5, CSS3, Vanilla JS)
│   └── backend/                    # Express REST API (Contact form & Projects) - Port 5001
│
└── React-Blog/                     # Combined React Blog & Week 2 REST APIs
    ├── frontend/                   # React 18 + Vite Frontend Client - Port 5173
    └── backend/                    # Express REST API (Blog + Auth + Tasks + Notes) - Port 5000
        ├── config/
        │   └── db.js               # Mongoose MongoDB connection & dev fallback
        ├── controllers/
        │   ├── authController.js   # User Registration, Login & Auth Profile
        │   ├── taskController.js   # To-Do List REST API CRUD operations
        │   └── noteController.js   # Notes App Backend API CRUD operations (User Scoped)
        ├── middleware/
        │   ├── authMiddleware.js   # JWT Authorization Middleware
        │   └── errorMiddleware.js  # Global Error Handling & 404 handler
        ├── models/
        │   ├── User.js             # Mongoose schema for User (bcrypt hashing)
        │   ├── Task.js             # Mongoose schema for Task (To-Do list)
        │   └── Note.js             # Mongoose schema for Note (User reference)
        ├── routes/
        │   ├── authRoutes.js       # Routes for /api/auth
        │   ├── taskRoutes.js       # Routes for /api/tasks
        │   └── noteRoutes.js       # Routes for /api/notes (Protected)
        ├── scripts/
        │   └── test-api.js         # Automated verification test suite
        ├── data/
        │   └── posts.json          # Persistent JSON dataset for blog posts & comments
        ├── .env                    # Environment configuration (PORT, MONGODB_URI, JWT_SECRET)
        ├── package.json            # Dependencies
        ├── server.js               # Main Express application entrypoint
        └── POSTMAN_TESTING.md      # Complete Postman testing guide for all 12 endpoints
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

### 1. React Blog & Week 2 Backend (Port 5000)
```bash
cd React-Blog/backend
npm install
npm run dev
# Server runs at http://localhost:5000
```

### 2. React Blog Frontend Client (Port 5173)
```bash
cd React-Blog/frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### 3. Portfolio Backend API (Port 5001)
```bash
cd Portfolio/backend
npm install
npm run dev
# Server runs at http://localhost:5001
```

---

## 🌐 API Endpoint Summary

| Feature / Module | Method | Endpoint | Access / Auth | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Blog Posts** | `GET` | `/api/posts` | Public | Fetch all blog posts |
| **Authentication** | `POST` | `/api/auth/register` | Public | Register new user & hash password with bcrypt |
| **Authentication** | `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| **Authentication** | `GET` | `/api/auth/me` | Protected (JWT) | Get current logged-in user profile |
| **To-Do List API** | `POST` | `/api/tasks` | Public | Create new task |
| **To-Do List API** | `GET` | `/api/tasks` | Public | Retrieve all tasks |
| **To-Do List API** | `PUT` | `/api/tasks/:id` | Public | Update task by ID |
| **To-Do List API** | `DELETE` | `/api/tasks/:id` | Public | Delete task by ID |
| **Notes App API** | `POST` | `/api/notes` | Protected (JWT) | Create note (assigned to auth user) |
| **Notes App API** | `GET` | `/api/notes` | Protected (JWT) | Get notes for auth user ONLY |
| **Notes App API** | `GET` | `/api/notes/:id` | Protected (JWT) | Get single note (Ownership checked) |
| **Notes App API** | `PUT` | `/api/notes/:id` | Protected (JWT) | Update note (Ownership checked) |
| **Notes App API** | `DELETE` | `/api/notes/:id` | Protected (JWT) | Delete note (Ownership checked) |

---

## 📮 Postman Testing

Refer to [POSTMAN_TESTING.md](file:///c:/Users/lokes/OneDrive/Desktop/Week1-Assignment/React-Blog/backend/POSTMAN_TESTING.md) for step-by-step Postman testing procedures, sample payloads, and token authorization steps.
