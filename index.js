// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/database');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// POST /transactions - Add a new transaction
app.post('/transactions', (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [type, category, amount, date, description], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// GET /transactions - Retrieve all transactions
app.get('/transactions', (req, res) => {
  const query = `SELECT * FROM transactions`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// GET /transactions/:id - Retrieve a transaction by ID
app.get('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM transactions WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json(row);
  });
});

// PUT /transactions/:id - Update a transaction by ID
app.put('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, description } = req.body;
  const query = `
    UPDATE transactions
    SET type = ?, category = ?, amount = ?, date = ?, description = ?
    WHERE id = ?
  `;
  db.run(query, [type, category, amount, date, description, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json({ message: 'Transaction updated' });
  });
});

// DELETE /transactions/:id - Delete a transaction by ID
app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM transactions WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json({ message: 'Transaction deleted' });
  });
});

// GET /summary - Summary of transactions (total income, expenses, and balance)
app.get('/summary', (req, res) => {
  const query = `
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
      (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) AS balance
    FROM transactions
  `;
  db.get(query, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
