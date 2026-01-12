const express = require('express');
const app = express();

// SQL Injection vulnerability
app.get('/search', (req, res) => {
  const query = req.query.q;
  const sql = "SELECT * FROM products WHERE name = '" + query + "'";
  db.query(sql, (err, results) => {
    res.json(results);
  });
});

// XSS vulnerability
app.get('/profile', (req, res) => {
  const name = req.query.name;
  res.send("<h1>Welcome " + name + "</h1>");
});

// Hardcoded secret
const API_KEY = "sk_live_1234567890abcdef";

module.exports = app;
