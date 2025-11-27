const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductsByVendor,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById
} = require('../controllers/productController');

// Get all products
router.get('/', getAllProducts);

// Get products by vendor
router.get('/vendor/:vendorId', getProductsByVendor);

// Get single product
router.get('/:id', getProductById);

// Add new product
router.post('/add', addProduct);

// Update product
router.put('/update/:id', updateProduct);

// Delete product
router.delete('/delete/:id', deleteProduct);

module.exports = router;
