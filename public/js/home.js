// Home Page JavaScript
const API_URL = 'http://localhost:4000';

// Default product images from local folder
const defaultProducts = [
  {
    id: 1,
    name: 'Classic Jacket',
    price: 89.99,
    image: '/public/images/products/jacket.png'
  },
  {
    id: 2,
    name: 'Cozy Sweatshirt',
    price: 59.99,
    image: '/public/images/products/sweatshirt.png'
  },
  {
    id: 3,
    name: 'Graphic Tee',
    price: 29.99,
    image: '/public/images/products/T.png'
  },
  {
    id: 4,
    name: 'Zip Hoodie',
    price: 74.99,
    image: '/public/images/products/zipper.png'
  }
];

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
  loadNewArrivals();
});

async function loadNewArrivals() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    
    // If API returns products, use them; otherwise use default products
    if (products && products.length > 0) {
      displayNewArrivals(products);
    } else {
      displayNewArrivals(defaultProducts);
    }
  } catch (error) {
    console.error('Error loading new arrivals:', error);
    // Fallback to default products if API fails
    displayNewArrivals(defaultProducts);
  }
}

function displayNewArrivals(products) {
  const grid = document.getElementById('arrivalsGrid');
  
  if (!grid) return;
  
  if (products.length === 0) {
    grid.innerHTML = '<div class="loading">No new arrivals available</div>';
    return;
  }

  // Show only first 4 products for new arrivals
  grid.innerHTML = products.slice(0, 4).map(product => `
    <a href="/views/order-page.html?id=${product.id}" class="product-card">
      <div class="product-image">
        <img src="${product.image || '/public/images/products/T.png'}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
      </div>
    </a>
  `).join('');
}
