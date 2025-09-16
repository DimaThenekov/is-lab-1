const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /auth/login - User login
router.post('/login', loginValidation, handleValidationErrors, (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ 
        message: 'Login successful', 
        access_token: token,
        user: { id: user.id, username: user.username }
      });
    });
  });
});

// POST /auth/register - User registration (optional)
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  User.findByUsername(username, (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    User.create({ username, password }, (err, newUser) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(201).json({ 
        message: 'User created successfully', 
        user: { id: newUser.id, username: newUser.username } 
      });
    });
  });
});

module.exports = router;