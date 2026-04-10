// Owner panel functionality for NotesByRaheem.xyz

/**
 * Initialize owner dashboard
 */
function initOwnerDashboard() {
    // Load owner stats
    updateOwnerStats();
    
    // Load system status
    loadSystemStatus();
    
    // Load recent activity
    loadOwnerActivity();
    
    // Setup event listeners
    setupOwnerEventListeners();
}

/**
 * Update owner statistics
 */
function updateOwnerStats() {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Calculate stats
    const totalNotes = notes.length;
    const approvedNotes = notes.filter(note => note.status === 'approved').length;
    const pendingNotes = notes.filter(note => note.status === 'pending').length;
    
    const totalUsers = users.length;
    const studentCount = users.filter(user => user.role === 'student').length;
    const adminCount = users.filter(user => user.role === 'admin').length;
    const ownerCount = users.filter(user => user.role === 'owner').length;
    
    // Calculate storage usage (simulated)
    const storageUsed = notes.reduce((total, note) => {
        return total + (note.files ? note.files.reduce((sum, file) => sum + (file.size || 0), 0) : 0);
    }, 0);
    const storageUsedMB = Math.round(storageUsed / (1024 * 1024));
    
    // Update UI elements
    const statsElements = {
        'total-users': totalUsers,
        'total-notes': totalNotes,
        'total-admins': adminCount,
        'total-students': studentCount,
        'approved-notes': approvedNotes,
        'pending-notes': pendingNotes,
        'storage-used': `${storageUsedMB} MB`,
        'active-sessions': users.length > 0 ? Math.min(users.length * 2, 50) : 12 // Simulated
    };
    
    for (const [id, value] of Object.entries(statsElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

/**
 * Load system status
 */
function loadSystemStatus() {
    const statusGrid = document.getElementById('system-status-grid');
    if (!statusGrid) return;
    
    // Simulated system status
    const systemStatus = [
        { id: 'auth', name: 'Authentication', status: 'operational', icon: 'fa-user-shield' },
        { id: 'database', name: 'Database', status: 'operational', icon: 'fa-database' },
        { id: 'storage', name: 'File Storage', status: 'operational', icon: 'fa-hdd' },
        { id: 'api', name: 'API Server', status: 'operational', icon: 'fa-server' },
        { id: 'email', name: 'Email Service', status: 'degraded', icon: 'fa-envelope' },
        { id: 'backup', name: 'Backup System', status: 'operational', icon: 'fa-save' }
    ];
    
    // Clear existing content
    statusGrid.innerHTML = '';
    
    // Add status cards
    systemStatus.forEach(status => {
        const statusCard = document.createElement('div');
        statusCard.className = `status-card status-${status.status}`;
        
        const statusClass = status.status === 'operational' ? 'success' : 
                          status.status === 'degraded' ? 'warning' : 'danger';
        
        statusCard.innerHTML = `
            <div class="status-icon">
                <i class="fas ${status.icon}"></i>
            </div>
            <div class="status-content">
                <h4 class="status-name">${status.name}</h4>
                <span class="status-badge badge-${statusClass}">${status.status}</span>
            </div>
        `;
        
        statusGrid.appendChild(statusCard);
    });
}

/**
 * Load owner activity
 */
function loadOwnerActivity() {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const activityList = document.getElementById('owner-activity-list');
    
    if (!activityList) return;
    
    // Combine recent activities
    const recentActivities = [];
    
    // Add note approvals/rejections
    notes
        .filter(note => note.status === 'approved' || note.status === 'rejected')
        .forEach(note => {
            recentActivities.push({
                type: note.status === 'approved' ? 'note_approved' : 'note_rejected',
                title: note.title,
                user: note.status === 'approved' ? note.approvedBy : note.rejectedBy,
                date: note.status === 'approved' ? note.approvedAt : note.rejectedAt,
                description: note.status === 'approved' ? 'Note approved' : 'Note rejected'
            });
        });
    
    // Add user registrations (simulated)
    users.slice(-5).forEach(user => {
        recentActivities.push({
            type: 'user_registered',
            title: `New ${user.role} registered`,
            user: user.name,
            date: user.registeredAt || new Date().toISOString(),
            description: `${user.name} joined as ${user.role}`
        });
    });
    
    // Sort by date (newest first)
    recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear existing content
    activityList.innerHTML = '';
    
    if (recentActivities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history fa-3x"></i>
                <h3>No activity yet</h3>
                <p>System activity will appear here.</p>
            </div>
        `;
        return;
    }
    
    // Add activity items (limit to 8)
    recentActivities.slice(0, 8).forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = activity.type === 'note_approved' ? 'fa-check-circle text-success' :
                    activity.type === 'note_rejected' ? 'fa-times-circle text-danger' :
                    activity.type === 'user_registered' ? 'fa-user-plus text-info' : 'fa-info-circle';
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <h4 class="activity-title">${activity.title}</h4>
                <p class="activity-description">${activity.description}</p>
                <span class="activity-meta">By ${activity.user} • ${formatDate(activity.date)}</span>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

/**
 * Setup owner event listeners
 */
function setupOwnerEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateOwnerStats();
            loadSystemStatus();
            loadOwnerActivity();
        });
    }
    
    // Manage users button
    const manageUsersBtn = document.getElementById('manage-users-btn');
    if (manageUsersBtn) {
        manageUsersBtn.addEventListener('click', () => {
            // In a real app, this would navigate to a users management page
            alert('This would navigate to a users management page in a real application.');
        });
    }
    
    // System settings button
    const systemSettingsBtn = document.getElementById('system-settings-btn');
    if (systemSettingsBtn) {
        systemSettingsBtn.addEventListener('click', () => {
            // In a real app, this would navigate to a system settings page
            alert('This would navigate to a system settings page in a real application.');
        });
    }
    
    // Backup button
    const backupBtn = document.getElementById('backup-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to create a system backup?')) {
                showNotification('System backup initiated. This may take a few minutes.', 'info');
                // Simulate backup process
                setTimeout(() => {
                    showNotification('System backup completed successfully.', 'success');
                }, 3000);
            }
        });
    }
    
    // Analytics button
    const analyticsBtn = document.getElementById('analytics-btn');
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', () => {
            // In a real app, this would navigate to an analytics page
            alert('This would navigate to an analytics page in a real application.');
        });
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close button event listener
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Initialize user management page
 */
function initUserManagement() {
    loadUsers();
    setupUserManagementListeners();
}

/**
 * Load users for management
 */
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const usersTable = document.getElementById('users-table-body');
    
    if (!usersTable) return;
    
    // Clear existing content
    usersTable.innerHTML = '';
    
    if (users.length === 0) {
        usersTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-users fa-3x"></i>
                        <h3>No users found</h3>
                        <p>Users will appear here once they are added.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Add users to table
    users.forEach(user => {
        const row = document.createElement('tr');
        
        const roleClass = user.role === 'owner' ? 'badge-owner' :
                         user.role === 'admin' ? 'badge-admin' : 'badge-student';
        
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.email || 'N/A'}</td>
            <td><span class="badge ${roleClass}">${user.role}</span></td>
            <td>${formatDate(user.registeredAt || new Date().toISOString())}</td>
            <td>
                <button class="btn-edit-user" data-username="${user.username}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-user" data-username="${user.username}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        usersTable.appendChild(row);
    });
}

/**
 * Setup user management event listeners
 */
function setupUserManagementListeners() {
    // Add user button
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }
    
    // Edit user buttons
    document.addEventListener('click', function(event) {
        if (event.target.closest('.btn-edit-user')) {
            const username = event.target.closest('.btn-edit-user').getAttribute('data-username');
            editUser(username);
        }
        
        if (event.target.closest('.btn-delete-user')) {
            const username = event.target.closest('.btn-delete-user').getAttribute('data-username');
            deleteUser(username);
        }
    });
}

/**
 * Show add user modal
 */
function showAddUserModal() {
    // In a real app, this would show a modal
    const username = prompt('Enter username:');
    if (!username) return;
    
    const name = prompt('Enter full name:');
    if (!name) return;
    
    const email = prompt('Enter email (optional):');
    
    const role = prompt('Enter role (student/admin/owner):');
    if (!['student', 'admin', 'owner'].includes(role)) {
        alert('Invalid role. Must be student, admin, or owner.');
        return;
    }
    
    const password = prompt('Enter password:');
    if (!password) return;
    
    // Add user
    addUser(username, name, email, role, password);
}

/**
 * Add a new user
 */
function addUser(username, name, email, role, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(user => user.username === username)) {
        alert('User already exists.');
        return;
    }
    
    // Add new user
    users.push({
        username,
        name,
        email: email || '',
        role,
        password, // In a real app, this would be hashed
        registeredAt: new Date().toISOString(),
        active: true
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reload users
    loadUsers();
    
    showNotification(`User ${username} added successfully.`, 'success');
}

/**
 * Edit a user
 */
function editUser(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username);
    
    if (!user) {
        alert('User not found.');
        return;
    }
    
    // In a real app, this would show an edit modal
    const newName = prompt('Enter new name:', user.name);
    if (!newName) return;
    
    const newEmail = prompt('Enter new email:', user.email || '');
    const newRole = prompt('Enter new role (student/admin/owner):', user.role);
    
    if (!['student', 'admin', 'owner'].includes(newRole)) {
        alert('Invalid role. Must be student, admin, or owner.');
        return;
    }
    
    // Update user
    user.name = newName;
    user.email = newEmail;
    user.role = newRole;
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reload users
    loadUsers();
    
    showNotification(`User ${username} updated successfully.`, 'success');
}

/**
 * Delete a user
 */
function deleteUser(username) {
    if (!confirm(`Are you sure you want to delete user ${username}?`)) {
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(user => user.username !== username);
    
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    
    // Reload users
    loadUsers();
    
    showNotification(`User ${username} deleted successfully.`, 'success');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initOwnerDashboard,
        updateOwnerStats,
        loadSystemStatus,
        loadOwnerActivity,
        initUserManagement,
        loadUsers,
        addUser,
        editUser,
        deleteUser
    };
}