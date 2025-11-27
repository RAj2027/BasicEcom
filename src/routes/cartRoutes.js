// Cart Routes - Handle cart operations
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route   POST /cart/add
 * @desc    Add a product to user's cart
 * @body    { user_id, product_id, qty }
 */
router.post('/add', (req, res) => {
  const { user_id, product_id, qty = 1 } = req.body;

  // Validate required fields
  if (!user_id || !product_id) {
    return res.status(400).json({
      message: 'Missing required fields: user_id and product_id'
    });
  }

  // Insert into cart_items table
  const insertQuery = 'INSERT INTO cart_items (user_id, product_id, qty) VALUES (?, ?, ?)';
  
  db.query(insertQuery, [user_id, product_id, qty], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        message: 'Failed to add product to cart',
        error: err.message
      });
    }

    return res.status(201).json({
      message: 'Product added to cart',
      cart_item_id: result.insertId
    });
  });
});

/**
 * @route   GET /cart/:user_id
 * @desc    Get all cart items for a user with product details
 */
router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      c.id,
      p.name,
      p.price,
      c.qty,
      p.id as product_id,
      p.image
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        message: 'Failed to fetch cart',
        error: err.message
      });
    }

    return res.status(200).json(results);
  });
});

/**
 * @route   PUT /cart/update/:id
 * @desc    Update cart item quantity
 * @body    { qty }
 */
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;

  // Validate quantity
  if (!qty || qty < 1) {
    return res.status(400).json({
      message: 'Invalid quantity. Must be at least 1'
    });
  }

  const updateQuery = 'UPDATE cart_items SET qty = ? WHERE id = ?';
  
  db.query(updateQuery, [qty, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        message: 'Failed to update quantity',
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Cart item not found'
      });
    }

    return res.status(200).json({
      message: 'Quantity updated successfully',
      qty: qty
    });
  });
});

/**
 * @route   DELETE /cart/delete/:id
 * @desc    Remove item from cart by cart_item id
 */
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM cart_items WHERE id = ?';
  
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        message: 'Failed to remove item',
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Item not found'
      });
    }

    return res.status(200).json({
      message: 'Item removed'
    });
  });
});

module.exports = router;
