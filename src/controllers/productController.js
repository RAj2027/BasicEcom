const db = require('../config/db');

// Get all products
const getAllProducts = (req, res) => {
  const query = 'SELECT * FROM products ORDER BY created_at DESC';
  
  db.query(query, (err, products) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(products);
  });
};

// Get products by vendor
const getProductsByVendor = (req, res) => {
  const { vendorId } = req.params;
  const query = 'SELECT * FROM products WHERE vendor_id = ? ORDER BY created_at DESC';
  
  db.query(query, [vendorId], (err, products) => {
    if (err) {
      console.error('Error fetching vendor products:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(products);
  });
};

// Add new product
const addProduct = (req, res) => {
  const { vendor_id, name, price, stock, description, image, category } = req.body;

  // Validate required fields
  if (!vendor_id || !name || !price || stock === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = 'INSERT INTO products (vendor_id, name, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [
    vendor_id,
    name,
    price,
    stock,
    description || '',
    image || '/public/images/products/shirt1.png'
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    res.status(201).json({
      message: 'Product added successfully',
      productId: result.insertId
    });
  });
};

// Update product
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description, image } = req.body;

  const query = 'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, image = ? WHERE id = ?';
  const values = [name, price, stock, description, image, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  });
};

// Delete product
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  });
};

// Get single product
const getProductById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';

  db.query(query, [id], (err, products) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  });
};

module.exports = {
  getAllProducts,
  getProductsByVendor,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById
};
