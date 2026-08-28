# Week 1 Assignment - Full-Stack Portfolio & React Blog

This repository is divided into modular **Frontend** and **Backend** services for both the **Portfolio** website and the **React Blog Application**, configured for standalone development and cloud deployment.

---

## 📁 Project Architecture

```
Week1-Assignment/
│
├── Portfolio/
│   ├── frontend/                 # Portfolio Static Frontend (HTML5, CSS3, Vanilla JS)
│   │   ├── index.html            # Main HTML document
│   │   ├── style.css             # Glassmorphism dark/light design system
│   │   └── script.js             # Interactive logic & API contact form connection
│   │
│   └── backend/                  # Portfolio Node.js/Express API Backend
│       ├── server.js             # Contact submission & projects REST API
│       ├── package.json          # Node dependencies
│       ├── vercel.json           # Vercel serverless deployment configuration
│       └── data/
│           └── messages.json     # Saved contact form submissions
│
└── React-Blog/
    ├── frontend/                 # React 18 + Vite Frontend Client Application
    │   ├── src/                  # Components, App.jsx, styles, & assets
    │   ├── index.html            # Vite entrypoint
    │   ├── package.json          # Frontend dependencies (React, Vite, Lucide)
    │   └── .env.example          # VITE_API_URL environment template
    │
    └── backend/                  # React Blog Node.js/Express REST API Backend
        ├── server.js             # Blog posts, comments, & likes API
        ├── package.json          # Node dependencies
        ├── vercel.json           # Vercel serverless deployment configuration
        └── data/
            └── posts.json        # Persistent JSON dataset for blog posts & comments
```

---

## 🚀 Running Locally

### 1. Portfolio Website

#### Backend API (Port 5001)
```bash
cd Portfolio/backend
npm install
npm run dev
# Server runs at http://localhost:5001
```

#### Frontend
Open `Portfolio/frontend/index.html` directly in a browser, or serve using any static HTTP server (e.g. `npx serve Portfolio/frontend`).

---

### 2. React Blog Application

#### Backend API (Port 5000)
```bash
cd React-Blog/backend
npm install
npm run dev
# Server runs at http://localhost:5000
```

#### Frontend Client (Port 5173)
```bash
cd React-Blog/frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

---

## 🌐 Deployment Instructions

### A. Deploying Backends (Express APIs)

#### Option 1: Render.com (Recommended for Node.js Express)
1. Push your repository to GitHub.
2. Sign in to [Render.com](https://render.com) and create a **New Web Service**.
3. For **Portfolio Backend**:
   - Root Directory: `Portfolio/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. For **React Blog Backend**:
   - Root Directory: `React-Blog/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

#### Option 2: Vercel Serverless
Both backends include a `vercel.json` file.
```bash
# Deploy Portfolio Backend
cd Portfolio/backend
vercel

# Deploy React-Blog Backend
cd React-Blog/backend
vercel
```

---

### B. Deploying Frontends

#### 1. Portfolio Frontend
- **Vercel / Netlify / GitHub Pages**:
  - Deploy `Portfolio/frontend` folder as a static site.
  - Set Environment / Script global `window.PORTFOLIO_API_URL` to your deployed backend URL (e.g. `https://your-portfolio-backend.onrender.com/api/contact`).

#### 2. React Blog Frontend
- **Vercel / Netlify**:
  - Root Directory: `React-Blog/frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variable: `VITE_API_URL=https://your-blog-backend.onrender.com`
