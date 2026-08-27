# Week 1 Assignment - Portfolio & React Blog UI

This repository contains two projects built for the Week 1 Assignment:

1. **Portfolio Website** (`Portfolio/`)
2. **React Blog UI Application** (`React-Blog/`)

---

## 📁 Repository Structure

```
Week1-Assignment/
│
├── Portfolio/
│   ├── index.html        # Main HTML5 semantic structure
│   ├── style.css         # Modern dark mode design system CSS
│   └── script.js         # Interactive JS for menu, filters & form
│
└── React-Blog/
    ├── package.json      # Dependencies and scripts
    ├── README.md         # Documentation
    ├── index.html        # Vite HTML entrypoint
    ├── vite.config.js    # Vite configuration
    └── src/
        ├── components/
        │   ├── Header.jsx   # Top Navigation & Search Header Component
        │   ├── Footer.jsx   # Footer with Newsletter Form Component
        │   ├── Card.jsx     # Reusable Post Card Component
        │   ├── Button.jsx   # Reusable Multi-Variant Button Component
        │   └── Form.jsx     # Reusable Form & Validation Component
        ├── data/
        │   └── posts.json   # Blog post dataset
        ├── App.jsx          # App state, search/filter, reader & write modals
        ├── App.css          # Design tokens & glassmorphism layout
        └── main.jsx         # React 18 DOM mount point
```

---

## 🚀 1. Portfolio Website Features

- **About Section**: Professional summary, key skills, experience indicators.
- **Education Section**: Vertical glassmorphism timeline detailing degrees, academic achievements, and coursework.
- **Projects Section**: Interactive filter buttons (`All`, `Full-Stack`, `Frontend`, `AI / Tooling`) with hover effects and direct links.
- **Contact Section**: Interactive contact form with real-time validation and submission toast feedback.
- **Responsive Layout**: Mobile navigation drawer, scroll reveal animations, glassmorphism UI elements.

---

## ⚡ 2. React Blog UI Features

- **5 Reusable React Components**:
  - `Header`: Navigation, live search bar, posts counter, and article creation trigger.
  - `Footer`: Categories list, social links, and newsletter subscription form.
  - `Card`: Displays blog metadata, category badges, read time, views, and like count.
  - `Button`: Flexible button component supporting `primary`, `secondary`, `outline`, `ghost`, and `danger` variants.
  - `Form`: Reusable form generator supporting text inputs, textareas, selects, and error validation feedback.
- **Search & Filter Functionality**:
  - Real-time text search matching titles, excerpts, tags, and categories.
  - Category pill filter tags (`React`, `Design System`, `AI & ML`, `Web Dev`, `Cloud`).
  - Sorting options (`Latest Published`, `Most Liked`, `Quickest Read`).
- **Interactive State**:
  - Like button toggles updating count state.
  - Reader Modal displaying full article details.
  - "Publish New Article" Modal adding new posts dynamically to the blog feed.

---

## 🛠️ How to Run

### Portfolio
Open `Portfolio/index.html` directly in any web browser.

### React Blog UI
```bash
cd React-Blog
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
