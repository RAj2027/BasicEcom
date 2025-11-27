// Authentication Helper Functions

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Get current user data
 * @returns {object|null}
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  window.location.href = '/views/login.html';
}

/**
 * Require authentication - redirect to login if not logged in
 */
function requireAuth() {
  if (!isLoggedIn()) {
    alert('Please login to continue');
    window.location.href = '/views/login.html';
    return false;
  }
  return true;
}

/**
 * Update UI based on login status
 */
function updateAuthUI() {
  const user = getCurrentUser();
  const userIcon = document.querySelector('.nav-icons a[href="/login"]');
  
  if (user && userIcon) {
    // Update user icon to show profile or dashboard
    if (user.role === 'vendor') {
      userIcon.href = '/views/vendor-dashboard.html';
    } else {
      userIcon.href = '#';
      userIcon.onclick = (e) => {
        e.preventDefault();
        showUserMenu();
      };
    }
    userIcon.title = `Welcome, ${user.username}`;
  }
}

/**
 * Show user menu (logout option)
 */
function showUserMenu() {
  const user = getCurrentUser();
  if (confirm(`Logged in as ${user.username}\n\nDo you want to logout?`)) {
    logout();
  }
}

// Auto-update UI on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', updateAuthUI);
}
