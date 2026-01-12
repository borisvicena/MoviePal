const express = require('express');
const app = express();

// XSS vulnerability
app.get('/profile', (req, res) => {
  const name = req.query.name;
  res.send("<h1>Welcome " + name + "</h1>");
});

// Hardcoded secret
const API_KEY = "sk_live_1234567890abcdef";

module.exports = app;
