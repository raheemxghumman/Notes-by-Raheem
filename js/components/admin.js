// Admin panel functionality for NotesByRaheem.xyz

/**
 * Initialize admin dashboard
 */
function initAdminDashboard() {
    // Load admin stats
    updateAdminStats();
    
    // Load pending notes
    loadPendingNotes();
    
    // Load recent activity
    loadAdminActivity();
    
    // Setup event listeners
    setupAdminEventListeners();
}

/**
 * Update admin statistics
 */
function updateAdminStats() {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Calculate stats
    const pendingNotes = notes.filter(note => note.status === 'pending').length;
    const approvedNotes = notes.filter(note => note.status === 'approved').length;
    const rejectedNotes = notes.filter(note => note.status === 'rejected').length;
    const totalNotes = notes.length;
    
    const studentCount = users.filter(user => user.role === 'student').length;
    const adminCount = users.filter(user => user.role === 'admin').length;
    const totalUsers = users.length;
    
    // Update UI elements
    const statsElements = {
        'pending-notes': pendingNotes,
        'approved-notes': approvedNotes,
        'rejected-notes': rejectedNotes,
        'total-notes': totalNotes,
        'total-students': studentCount,
        'total-admins': adminCount,
        'total-users': totalUsers
    };
    
    for (const [id, value] of Object.entries(statsElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

/**
 * Load pending notes for approval
 */
function loadPendingNotes() {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const pendingNotes = notes.filter(note => note.status === 'pending');
    
    const pendingList = document.getElementById('pending-notes-list');
    if (!pendingList) return;
    
    // Clear existing content
    pendingList.innerHTML = '';
    
    if (pendingNotes.length === 0) {
        pendingList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle fa-3x"></i>
                <h3>No pending notes</h3>
                <p>All notes have been reviewed and processed.</p>
            </div>
        `;
        return;
    }
    
    // Add pending notes to the list
    pendingNotes.forEach(note => {
        const noteItem = createPendingNoteItem(note);
        pendingList.appendChild(noteItem);
    });
}

/**
 * Create a pending note list item
 */
function createPendingNoteItem(note) {
    const item = document.createElement('div');
    item.className = 'pending-note-item';
    item.setAttribute('data-note-id', note.id);
    
    // Get course info
    const courseInfo = getCourseInfo(note.course);
    
    // Format date
    const formattedDate = formatDate(note.uploadedAt);
    
    item.innerHTML = `
        <div class="note-info">
            <div class="note-header">
                <h4 class="note-title">${note.title}</h4>
                <span class="note-course" style="color: ${courseInfo.color}">
                    <i class="${courseInfo.icon}"></i> ${courseInfo.name}
                </span>
            </div>
            <p class="note-description">${note.description}</p>
            <div class="note-meta">
                <span class="note-author">
                    <i class="fas fa-user"></i> ${note.uploadedByName}
                </span>
                <span class="note-date">
                    <i class="fas fa-calendar"></i> ${formattedDate}
                </span>
                <span class="note-files">
                    <i class="fas fa-file"></i> ${note.files ? note.files.length : 0} files
                </span>
            </div>
        </div>
        <div class="note-actions">
            <button class="btn-approve" data-note-id="${note.id}">
                <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn-reject" data-note-id="${note.id}">
                <i class="fas fa-times"></i> Reject
            </button>
            <button class="btn-preview" data-note-id="${note.id}">
                <i class="fas fa-eye"></i> Preview
            </button>
        </div>
    `;
    
    // Add event listeners
    const approveBtn = item.querySelector('.btn-approve');
    const rejectBtn = item.querySelector('.btn-reject');
    const previewBtn = item.querySelector('.btn-preview');
    
    if (approveBtn) {
        approveBtn.addEventListener('click', () => approveNote(note.id));
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => showRejectModal(note.id));
    }
    
    if (previewBtn) {
        previewBtn.addEventListener('click', () => previewNote(note.id));
    }
    
    return item;
}

/**
 * Load admin activity
 */
function loadAdminActivity() {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const activityList = document.getElementById('admin-activity-list');
    
    if (!activityList) return;
    
    // Get recent admin actions (last 10)
    const recentActions = notes
        .filter(note => note.status === 'approved' || note.status === 'rejected')
        .sort((a, b) => {
            const dateA = a.approvedAt || a.rejectedAt || a.uploadedAt;
            const dateB = b.approvedAt || b.rejectedAt || b.uploadedAt;
            return new Date(dateB) - new Date(dateA);
        })
        .slice(0, 10);
    
    // Clear existing content
    activityList.innerHTML = '';
    
    if (recentActions.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history fa-3x"></i>
                <h3>No activity yet</h3>
                <p>Admin activity will appear here.</p>
            </div>
        `;
        return;
    }
    
    // Add activity items
    recentActions.forEach(note => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const action = note.status === 'approved' ? 'approved' : 'rejected';
        const actionBy = note.status === 'approved' ? note.approvedBy : note.rejectedBy;
        const actionDate = note.status === 'approved' ? note.approvedAt : note.rejectedAt;
        const icon = note.status === 'approved' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger';
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <h4 class="activity-title">${note.title}</h4>
                <p class="activity-description">
                    ${action === 'approved' ? 'Approved' : 'Rejected'} by ${actionBy || 'Admin'}
                    ${note.rejectionReason ? `: ${note.rejectionReason}` : ''}
                </p>
                <span class="activity-meta">${formatDate(actionDate)}</span>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

/**
 * Get course information
 */
function getCourseInfo(courseId) {
    const courses = {
        'mvc': { name: 'Multi-variable Calculus', icon: 'fas fa-calculator', color: '#4361ee' },
        'se': { name: 'Software Engineering', icon: 'fas fa-laptop-code', color: '#7209b7' },
        'cn': { name: 'Computer Networks', icon: 'fas fa-network-wired', color: '#f72585' },
        'cce': { name: 'Civics & Community', icon: 'fas fa-hands-helping', color: '#4cc9f0' },
        'vp': { name: 'Visual Programming', icon: 'fas fa-palette', color: '#f8961e' },
        'coal': { name: 'Computer Organization', icon: 'fas fa-microchip', color: '#f94144' }
    };
    
    return courses[courseId] || { name: 'Unknown Course', icon: 'fas fa-book', color: '#6c757d' };
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
 * Setup admin event listeners
 */
function setupAdminEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateAdminStats();
            loadPendingNotes();
            loadAdminActivity();
        });
    }
    
    // View all notes button
    const viewAllBtn = document.getElementById('view-all-notes');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            // In a real app, this would navigate to a notes management page
            alert('This would navigate to a notes management page in a real application.');
        });
    }
    
    // View all users button
    const viewAllUsersBtn = document.getElementById('view-all-users');
    if (viewAllUsersBtn) {
        viewAllUsersBtn.addEventListener('click', () => {
            // In a real app, this would navigate to a users management page
            alert('This would navigate to a users management page in a real application.');
        });
    }
}

/**
 * Approve a note
 */
function approveNote(noteId) {
    if (!confirm('Are you sure you want to approve this note?')) {
        return;
    }
    
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex !== -1) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
        
        notes[noteIndex].status = 'approved';
        notes[noteIndex].approvedAt = new Date().toISOString();
        notes[noteIndex].approvedBy = currentUser ? currentUser.name : 'Admin';
        
        localStorage.setItem('studentNotes', JSON.stringify(notes));
        
        // Update UI
        updateAdminStats();
        loadPendingNotes();
        loadAdminActivity();
        
        // Show success message
        showNotification(`Note "${notes[noteIndex].title}" has been approved.`, 'success');
    } else {
        showNotification('Note not found. It may have already been processed.', 'error');
    }
}

/**
 * Show reject modal
 */
function showRejectModal(noteId) {
    // In a real app, this would show a modal with a rejection reason
    const reason = prompt('Please enter a reason for rejecting this note:');
    
    if (reason !== null && reason.trim() !== '') {
        rejectNote(noteId, reason.trim());
    } else if (reason !== null) {
        alert('Please provide a reason for rejection.');
    }
}

/**
 * Reject a note
 */
function rejectNote(noteId, reason) {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex !== -1) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
        
        notes[noteIndex].status = 'rejected';
        notes[noteIndex].rejectedAt = new Date().toISOString();
        notes[noteIndex].rejectedBy = currentUser ? currentUser.name : 'Admin';
        notes[noteIndex].rejectionReason = reason;
        
        localStorage.setItem('studentNotes', JSON.stringify(notes));
        
        // Update UI
        updateAdminStats();
        loadPendingNotes();
        loadAdminActivity();
        
        // Show success message
        showNotification(`Note "${notes[noteIndex].title}" has been rejected. Reason: ${reason}`, 'success');
    } else {
        showNotification('Note not found. It may have already been processed.', 'error');
    }
}

/**
 * Preview a note
 */
function previewNote(noteId) {
    // In a real app, this would open a preview modal
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        alert(`Previewing note: ${note.title}\n\nDescription: ${note.description}\n\nCourse: ${getCourseInfo(note.course).name}\n\nUploaded by: ${note.uploadedByName}\n\nStatus: ${note.status}`);
    } else {
        alert('Note not found.');
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAdminDashboard,
        updateAdminStats,
        loadPendingNotes,
        loadAdminActivity,
        approveNote,
        rejectNote
    };
}