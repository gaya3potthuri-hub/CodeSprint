
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Please provide username, email, and password'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters'
    });
  }

  try {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [username, email, hashedPassword], (error, result) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            message: 'Email is already registered'
          });
        }

        console.error('Registration error:', error.message);
        return res.status(500).json({
          message: 'Registration failed'
        });
      }

      return res.status(201).json({
        message: 'Registration successful!',
        userId: result.insertId
      });
    });
  } catch (error) {
    console.error('Password hashing error:', error.message);
    return res.status(500).json({
      message: 'Registration failed'
    });
  }
});



app.get('/', (req, res) => {
  res.send('CodeSprint backend is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
