// Authentication Routes - Signup & Login
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @body    { username, email, password, role }
 */
router.post('/signup', async (req, res) => {
  const { username, email, password, role = 'customer' } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username, email, and password'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    // Check if user already exists
    const checkQuery = 'SELECT id FROM users WHERE email = ? OR username = ?';
    db.query(checkQuery, [email, username], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const insertQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [username, email, hashedPassword, role], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to create user'
          });
        }

        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: {
            id: result.insertId,
            username: username,
            email: email,
            role: role
          }
        });
      });
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Login user and return user data
 * @body    { email, password }
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Find user by email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = results[0];

    try {
      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Login successful - return user data (without password)
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  });
});

/**
 * @route   GET /auth/verify
 * @desc    Verify if user is logged in (check localStorage on frontend)
 */
router.get('/verify', (req, res) => {
  // This is a simple endpoint to check if auth system is working
  res.json({
    success: true,
    message: 'Auth system is active'
  });
});

module.exports = router;
