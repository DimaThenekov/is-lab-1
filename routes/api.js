const express = require('express');
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');
const { postValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// GET /api/data - Get all posts (protected)
router.get('/data', authenticateToken, (req, res) => {
  Post.findAll((err, posts) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Sanitize output to prevent XSS
    const sanitizedPosts = posts.map(post => ({
      id: post.id,
      title: post.title, // Already sanitized by validation middleware
      content: post.content, // Already sanitized by validation middleware
      userId: post.user_id,
      createdAt: post.created_at
    }));

    res.json({ posts: sanitizedPosts });
  });
});

// POST /api/posts - Create a new post (protected)
router.post('/posts', authenticateToken, postValidation, handleValidationErrors, (req, res) => {
  const { title, content } = req.body;

  Post.create({
    title,
    content,
    userId: req.user.id
  }, (err, newPost) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({ 
      message: 'Post created successfully', 
      post: newPost 
    });
  });
});

// GET /api/profile - Get user profile (protected)
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ 
    user: {
      id: req.user.id,
      username: req.user.username,
      createdAt: req.user.created_at
    }
  });
});

module.exports = router;