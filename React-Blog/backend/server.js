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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data', 'posts.json');

// Helper to read data safely
const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return { posts: [], comments: {} };
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw || '{"posts":[],"comments":{}}');
  } catch (error) {
    console.error('Error reading data file:', error);
    return { posts: [], comments: {} };
  }
};

// Helper to write data safely
const writeData = (data) => {
  try {
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'React Blog Backend API', timestamp: new Date().toISOString() });
});

// GET /api/posts - Fetch all blog posts
app.get('/api/posts', (req, res) => {
  const db = readData();
  res.json(db.posts);
});

// POST /api/posts - Create a new blog post
app.post('/api/posts', (req, res) => {
  const { title, excerpt, content, category, authorName, authorRole, readTime, tags, imageUrl } = req.body;

  if (!title || !excerpt || !content || !category) {
    return res.status(400).json({ error: 'Title, excerpt, content, and category are required.' });
  }

  const db = readData();
  const newPost = {
    id: Date.now(),
    title,
    excerpt,
    content,
    category,
    author: {
      name: authorName || 'Lokesh Vishnu',
      role: authorRole || 'Software Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: readTime ? `${readTime} min read` : '5 min read',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [category]),
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    likes: 0,
    views: 1,
    featured: false
  };

  db.posts.unshift(newPost);
  writeData(db);

  console.log(`[React Blog Backend] Created new post ID: ${newPost.id} - ${newPost.title}`);
  res.status(201).json(newPost);
});

// POST /api/posts/:id/like - Toggle post likes
app.post('/api/posts/:id/like', (req, res) => {
  const postId = Number(req.params.id);
  const db = readData();
  const post = db.posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const { isLiked } = req.body;
  if (isLiked) {
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post.likes += 1;
  }

  writeData(db);
  res.json({ id: post.id, likes: post.likes, liked: !isLiked });
});

// GET /api/posts/:id/comments - Fetch comments for a post
app.get('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const db = readData();
  const comments = db.comments[postId] || [];
  res.json(comments);
});

// POST /api/posts/:id/comments - Add a comment to a post
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = String(req.params.id);
  const { author, text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Comment text is required.' });
  }

  const db = readData();
  if (!db.comments[postId]) {
    db.comments[postId] = [];
  }

  const newComment = {
    id: Date.now(),
    author: author || 'Anonymous',
    text,
    date: 'Just now'
  };

  db.comments[postId].unshift(newComment);
  writeData(db);

  res.status(201).json(newComment);
});

app.listen(PORT, () => {
  console.log(`🚀 React-Blog Backend running on http://localhost:${PORT}`);
});
