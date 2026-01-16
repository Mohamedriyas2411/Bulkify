const express = require('express');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  res.json({ message: 'Get all products' });
});

// Create product
router.post('/', (req, res) => {
  res.json({ message: 'Create product' });
});

// Update product
router.put('/:id', (req, res) => {
  res.json({ message: 'Update product' });
});

// Delete product
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete product' });
});

module.exports = router;
