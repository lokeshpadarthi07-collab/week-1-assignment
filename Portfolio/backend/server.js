import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio Backend API is running 🚀"
  });
});

const messagesFilePath = path.join(__dirname, 'data', 'messages.json');

// Helper to ensure data directory and file exist
const ensureMessagesFile = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(messagesFilePath)) {
    fs.writeFileSync(messagesFilePath, JSON.stringify([], null, 2));
  }
};

ensureMessagesFile();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Portfolio Backend Service', timestamp: new Date().toISOString() });
});

// Projects API endpoint
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: "Stock-AI-Pro — AI Stock Predictor",
      category: "Python & SQLite",
      description: "Developed a comprehensive financial web application using Python, Flask, HTML, CSS, JavaScript, and SQLite to analyze historical stock market trends and display prediction-based insights.",
      highlights: [
        "Integrated statistical and prediction models to process raw historical stock ticker data.",
        "Built responsive UI dashboards displaying price trends, market indicators, and search tools.",
        "Connected Flask routing logic with SQLite database tables for historical data persistence."
      ],
      tech: ["Python", "Flask", "SQLite", "JavaScript", "HTML5", "CSS3"],
      github: "https://github.com/lokeshpadarthi07-collab/Stock-AI-Pro---AI-Stock-Predictor"
    },
    {
      id: 2,
      title: "Hospital Bed ICU Allocation System",
      category: "Python & Flask",
      description: "A specialized healthcare resource allocation platform built with Python and Flask to streamline real-time hospital bed and ICU room management during high demand scenarios.",
      highlights: [
        "Designed real-time tracking logic for emergency bed availability and allocation status.",
        "Engineered clean REST endpoints connecting frontend form inputs with backend allocation algorithms.",
        "Implemented intuitive administrative controls for hospital staff to manage occupancy."
      ],
      tech: ["Python", "Flask", "HTML5", "CSS3", "REST Logic"],
      github: "https://github.com/lokeshpadarthi07-collab"
    },
    {
      id: 3,
      title: "Chase the Number",
      category: "JavaScript Web App",
      description: "An interactive, logic-focused web game application built using pure vanilla JavaScript, DOM APIs, and CSS3 animations to challenge users with sequential pattern challenges.",
      highlights: [
        "Constructed dynamic game loops and state tracking algorithms in pure JavaScript.",
        "Created responsive visual feedback animations for sequential number selections.",
        "Optimized user interactions and DOM manipulation speed for zero latency."
      ],
      tech: ["JavaScript", "DOM API", "HTML5", "CSS3"],
      github: "https://github.com/lokeshpadarthi07-collab"
    }
  ];
  res.json(projects);
});

// Contact form submission endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields (name, email, subject, message) are required.' });
    }

    const newMessage = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString()
    };

    ensureMessagesFile();
    const rawData = fs.readFileSync(messagesFilePath, 'utf-8');
    const messages = JSON.parse(rawData || '[]');

    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));

    console.log(`[Portfolio Backend] Received contact form submission from ${name} (${email})`);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: newMessage
    });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    res.status(500).json({ error: 'Failed to process contact form submission.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio Backend running on http://localhost:${PORT}`);
});
