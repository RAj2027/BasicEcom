// Cart functionality

document.addEventListener('DOMContentLoaded', () => {
  // Quantity controls
  const quantityControls = document.querySelectorAll('.quantity-control');
  
  quantityControls.forEach(control => {
    const decreaseBtn = control.querySelector('.btn-quantity:first-child');
    const increaseBtn = control.querySelector('.btn-quantity:last-child');
    const quantitySpan = control.querySelector('.quantity');
    
    decreaseBtn.addEventListener('click', () => {
      let quantity = parseInt(quantitySpan.textContent);
      if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
        updateCart();
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      let quantity = parseInt(quantitySpan.textContent);
      quantity++;
      quantitySpan.textContent = quantity;
      updateCart();
    });
  });

  // Remove item buttons
  const removeButtons = document.querySelectorAll('.btn-remove');
  
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const cartItem = e.target.closest('.cart-item');
      if (confirm('Are you sure you want to remove this item from your cart?')) {
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          cartItem.remove();
          updateCart();
        }, 300);
      }
    });
  });

  // Apply promo code
  const applyBtn = document.querySelector('.btn-apply');
  const promoInput = document.querySelector('.promo-input-wrapper input');
  
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const promoCode = promoInput.value.trim();
      if (promoCode) {
        alert(`Promo code "${promoCode}" applied!`);
        promoInput.value = '';
      } else {
        alert('Please enter a promo code');
      }
    });
  }

  // Checkout button
  const checkoutBtn = document.querySelector('.btn-checkout');
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = '/checkout';
    });
  }

  // Update cart totals
  function updateCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
      const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
      const quantity = parseInt(item.querySelector('.quantity').textContent);
      subtotal += price * quantity;
    });
    
    const discount = subtotal * 0.2;
    const deliveryFee = 15;
    const total = subtotal - discount + deliveryFee;
    
    // Update summary values
    document.querySelector('.summary-row:nth-child(1) .summary-value').textContent = `$${subtotal}`;
    document.querySelector('.summary-row.discount .summary-value').textContent = `-$${discount.toFixed(0)}`;
    document.querySelector('.summary-row.total .summary-value').textContent = `$${total.toFixed(0)}`;
  }

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user) {
    const userIcon = document.querySelector('.nav-icons a[href="/login"]');
    if (userIcon) {
      userIcon.href = user.role === 'vendor' ? '/vendor-dashboard' : '/profile';
      userIcon.title = `Welcome, ${user.name}`;
    }
  }
});
