// Database Configuration and Connection
const mysql = require('mysql2');

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3307, 
  password: '', // Update with your MySQL password if needed
  database: 'dummyDB'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database: dummyDB');
  
  // Create tables after successful connection
  createTables();
});

// Function to create all required tables
const createTables = () => {
  // Users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('customer', 'vendor', 'admin') DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Products table
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vendor_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      stock INT DEFAULT 0,
      category VARCHAR(100) DEFAULT 'General',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Cart items table
  const createCartItemsTable = `
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      qty INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `;

  // Orders table
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      payment_mode VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Order items table
  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      qty INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `;

  // Execute table creation queries
  const tables = [
    { name: 'users', query: createUsersTable },
    { name: 'products', query: createProductsTable },
    { name: 'cart_items', query: createCartItemsTable },
    { name: 'orders', query: createOrdersTable },
    { name: 'order_items', query: createOrderItemsTable }
  ];

  tables.forEach((table) => {
    db.query(table.query, (err) => {
      if (err) {
        console.error(`❌ Error creating ${table.name} table:`, err.message);
      } else {
        console.log(`✅ Table '${table.name}' ready`);
      }
    });
  });
};

// Export database connection
module.exports = db;
