// Authentication utilities for NotesByRaheem.xyz

/**
 * Check if user is authenticated
 * @returns {Object|null} User object or null
 */
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    return user;
}

/**
 * Check if user has specific role
 * @param {string} role - Role to check (student, admin, owner)
 * @returns {boolean} True if user has the role
 */
function hasRole(role) {
    const user = checkAuth();
    return user && user.role === role;
}

/**
 * Redirect to login if not authenticated
 * @param {string} requiredRole - Required role (optional)
 */
function requireAuth(requiredRole = null) {
    const user = checkAuth();
    
    if (!user) {
        window.location.href = '../login.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        // Redirect based on role
        switch(user.role) {
            case 'student':
                window.location.href = '../student/dashboard.html';
                break;
            case 'admin':
                window.location.href = '../admin/dashboard.html';
                break;
            case 'owner':
                window.location.href = '../owner/dashboard.html';
                break;
            default:
                window.location.href = '../login.html';
        }
        return false;
    }
    
    return true;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = '../login.html';
}

/**
 * Get current user name
 * @returns {string} User name or 'User'
 */
function getCurrentUserName() {
    const user = checkAuth();
    return user ? user.name : 'User';
}

/**
 * Update user name in UI elements with class 'user-name'
 */
function updateUserNameInUI() {
    const userName = getCurrentUserName();
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = userName;
    });
}

/**
 * Initialize authentication check on page load
 * @param {string} requiredRole - Required role (optional)
 */
function initAuth(requiredRole = null) {
    document.addEventListener('DOMContentLoaded', function() {
        if (!requireAuth(requiredRole)) {
            return;
        }
        
        // Update user name in UI
        updateUserNameInUI();
        
        // Setup logout button if exists
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
        // Setup mobile menu toggle if exists
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
        }
    });
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkAuth,
        hasRole,
        requireAuth,
        logout,
        getCurrentUserName,
        updateUserNameInUI,
        initAuth
    };
}
