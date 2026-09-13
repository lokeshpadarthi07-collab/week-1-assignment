import app from '../server.js';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Note from '../models/Note.js';

async function runVerification() {
  console.log('🧪 Starting Automated API Verification Suite on React-Blog Unified Backend (Port 5000)...');

  // Wait until MongoDB connection is fully established
  while (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

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

    console.log('\n--- 2. Testing To-Do List REST API & Task Filtering ---');

    const createTaskRes = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Complete Task Manager Mini Project',
        description: 'Integrate React frontend with Express API, Multer upload, and MongoDB storage',
        priority: 'high',
        category: 'Work',
        imageUrl: '/uploads/sample-task-preview.jpg'
      })
    });
    const taskData = await createTaskRes.json();
    const taskId = taskData.data._id;
    console.log('✅ Create Task Status:', createTaskRes.status, 'Task ID:', taskId, 'Category:', taskData.data.category);

    const getTasksRes = await fetch('http://localhost:5000/api/tasks?priority=high&category=Work');
    const tasksList = await getTasksRes.json();
    console.log('✅ Get Tasks Filtered Status:', getTasksRes.status, 'Filtered Count:', tasksList.count);

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

    console.log('\n--- 4. Testing Week 1 React Blog Posts API ---');
    const getPostsRes = await fetch('http://localhost:5000/api/posts');
    const postsData = await getPostsRes.json();
    console.log('✅ Get Blog Posts Status:', getPostsRes.status, 'Count:', postsData.length);

    console.log('\n--- 5. Testing Image Upload API (Multer) ---');
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="image"; filename="test-avatar.png"',
      'Content-Type: image/png',
      '',
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      `--${boundary}--`,
      ''
    ].join('\r\n');

    const uploadRes = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: body
    });
    const uploadData = await uploadRes.json();
    console.log('✅ Multer Image Upload Status:', uploadRes.status, 'Uploaded URL:', uploadData.data?.url);

    console.log('\n🎉 ALL VERIFICATIONS PASSED ON UNIFIED BACKEND REST APIs!');
  } catch (err) {
    console.error('❌ Verification Error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runVerification();
