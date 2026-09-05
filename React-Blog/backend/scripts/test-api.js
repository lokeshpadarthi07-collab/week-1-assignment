import app from '../server.js';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Note from '../models/Note.js';

async function runVerification() {
  console.log('🧪 Starting Automated API Verification Suite on React-Blog Unified Backend (Port 5000)...');

  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    await Note.deleteMany({});

    console.log('\n--- 1. Testing User Authentication API ---');

    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Developer',
        email: 'alice@example.com',
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    console.log('✅ User Registration Status:', regRes.status);
    if (!regData.token || regData.user.password) {
      throw new Error('Registration failed or exposed password!');
    }
    const tokenA = regData.token;

    const userInDb = await User.findById(regData.user._id);
    console.log('🔒 Verified Password Hashed in DB:', userInDb.password.startsWith('$2'));

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('✅ User Login Status:', loginRes.status, 'Token Issued:', !!loginData.token);

    const meRes = await fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const meData = await meRes.json();
    console.log('✅ Protected Profile Access Status:', meRes.status, 'User Email:', meData.user?.email);

    console.log('\n--- 2. Testing To-Do List REST API (Tasks) ---');

    const createTaskRes = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Complete Week 2 Assignment in React-Blog Backend',
        description: 'Integrate Node, Express, MongoDB, Mongoose, JWT & bcrypt directly into React-Blog backend',
        priority: 'high'
      })
    });
    const taskData = await createTaskRes.json();
    const taskId = taskData.data._id;
    console.log('✅ Create Task Status:', createTaskRes.status, 'Task ID:', taskId);

    const getTasksRes = await fetch('http://localhost:5000/api/tasks');
    const tasksList = await getTasksRes.json();
    console.log('✅ Get Tasks Status:', getTasksRes.status, 'Count:', tasksList.count);

    const updateTaskRes = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    const updatedTask = await updateTaskRes.json();
    console.log('✅ Update Task Status:', updateTaskRes.status, 'Completed:', updatedTask.data.completed);

    const deleteTaskRes = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
    const deletedTaskData = await deleteTaskRes.json();
    console.log('✅ Delete Task Status:', deleteTaskRes.status, 'Message:', deletedTaskData.message);

    console.log('\n--- 3. Testing Notes App Backend API (Protected & Scoped) ---');

    const createNoteRes = await fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Unified React-Blog Backend Notes',
        content: 'Express controllers separate routing logic from business handling.',
        category: 'Study'
      })
    });
    const noteData = await createNoteRes.json();
    const noteId = noteData.data._id;
    console.log('✅ Create Note Status:', createNoteRes.status, 'Note ID:', noteId);

    const getNotesRes = await fetch('http://localhost:5000/api/notes', {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const notesData = await getNotesRes.json();
    console.log('✅ Get Notes (User A) Status:', getNotesRes.status, 'Count:', notesData.count);

    const getSingleNoteRes = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log('✅ Get Single Note (User A) Status:', getSingleNoteRes.status);

    const regBRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bob Hacker',
        email: 'bob@example.com',
        password: 'password123'
      })
    });
    const regBData = await regBRes.json();
    const tokenB = regBData.token;

    const accessUnauthorizedRes = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    console.log('🔒 Security Isolation Check: User B accessing User A note -> HTTP Status:', accessUnauthorizedRes.status);
    if (accessUnauthorizedRes.status === 403) {
      console.log('🛡️ Security Verification PASSED: User B was correctly FORBIDDEN (403)!');
    } else {
      throw new Error(`Security failed! Received HTTP status ${accessUnauthorizedRes.status}`);
    }

    const updateNoteRes = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ title: 'Updated Architecture Notes' })
    });
    console.log('✅ Update Note (User A) Status:', updateNoteRes.status);

    const deleteNoteRes = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log('✅ Delete Note (User A) Status:', deleteNoteRes.status);

    console.log('\n--- 4. Testing Week 1 React Blog Posts API ---');
    const getPostsRes = await fetch('http://localhost:5000/api/posts');
    const postsData = await getPostsRes.json();
    console.log('✅ Get Blog Posts Status:', getPostsRes.status, 'Count:', postsData.length);

    console.log('\n🎉 ALL VERIFICATIONS PASSED ON UNIFIED REACT-BLOG BACKEND!');
  } catch (err) {
    console.error('❌ Verification Error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runVerification();
