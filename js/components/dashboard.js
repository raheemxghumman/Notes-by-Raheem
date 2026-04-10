// Dashboard-specific functionality for NotesByRaheem.xyz

/**
 * Update dashboard statistics
 */
function updateDashboardStats() {
    // Get notes data from localStorage
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    
    if (!currentUser) return;
    
    // Calculate stats based on user role
    if (currentUser.role === 'student') {
        // Student-specific stats
        const studentNotes = notes.filter(note => note.uploadedBy === currentUser.username);
        const uploadedCount = studentNotes.length;
        const approvedCount = studentNotes.filter(note => note.status === 'approved').length;
        const pendingCount = studentNotes.filter(note => note.status === 'pending').length;
        
        // Update UI elements
        const statsElements = {
            'notes-uploaded': uploadedCount,
            'notes-approved': approvedCount,
            'notes-pending': pendingCount
        };
        
        for (const [id, value] of Object.entries(statsElements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
        
        // Update course-specific stats
        updateCourseStats();
    } else if (currentUser.role === 'admin') {
        // Admin-specific stats
        const pendingNotes = notes.filter(note => note.status === 'pending').length;
        const approvedNotes = notes.filter(note => note.status === 'approved').length;
        const rejectedNotes = notes.filter(note => note.status === 'rejected').length;
        const totalNotes = notes.length;
        
        // Update UI elements
        const statsElements = {
            'pending-notes': pendingNotes,
            'approved-notes': approvedNotes,
            'rejected-notes': rejectedNotes,
            'total-notes': totalNotes
        };
        
        for (const [id, value] of Object.entries(statsElements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    } else if (currentUser.role === 'owner') {
        // Owner-specific stats
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const totalUsers = users.length;
        const studentCount = users.filter(user => user.role === 'student').length;
        const adminCount = users.filter(user => user.role === 'admin').length;
        const totalNotes = notes.length;
        
        // Update UI elements
        const statsElements = {
            'total-users': totalUsers,
            'total-notes': totalNotes,
            'total-admins': adminCount,
            'total-students': studentCount
        };
        
        for (const [id, value] of Object.entries(statsElements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    }
}

/**
 * Update course-specific statistics
 */
function updateCourseStats() {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const courses = [
        { id: 'mvc', name: 'Multi-variable Calculus' },
        { id: 'se', name: 'Software Engineering' },
        { id: 'cn', name: 'Computer Networks' },
        { id: 'cce', name: 'Civics and Community Engagement' },
        { id: 'vp', name: 'Visual Programming' },
        { id: 'coal', name: 'Computer Organization and Assembly Language' }
    ];
    
    courses.forEach(course => {
        const courseNotes = notes.filter(note => note.course === course.id && note.status === 'approved');
        const count = courseNotes.length;
        
        // Update course card stats
        const countElement = document.querySelector(`.course-card.${course.id} .course-notes-count`);
        if (countElement) {
            countElement.textContent = `${count} notes`;
        }
    });
}

/**
 * Load recent activity
 */
function loadRecentActivity() {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    
    if (!currentUser) return;
    
    // Filter activities based on user role
    let activities = [];
    
    if (currentUser.role === 'student') {
        // Student sees their own uploads and approvals
        activities = notes
            .filter(note => note.uploadedBy === currentUser.username)
            .map(note => ({
                type: note.status === 'approved' ? 'approved' : 'uploaded',
                title: note.title,
                course: note.course,
                date: note.uploadedAt || note.approvedAt,
                description: note.status === 'approved' ? 'Your note was approved' : 'You uploaded a new note'
            }));
    } else if (currentUser.role === 'admin') {
        // Admin sees pending notes and recent approvals
        const pendingNotes = notes.filter(note => note.status === 'pending');
        const recentApprovals = notes
            .filter(note => note.status === 'approved')
            .sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt))
            .slice(0, 5);
        
        activities = [
            ...pendingNotes.map(note => ({
                type: 'pending',
                title: note.title,
                course: note.course,
                date: note.uploadedAt,
                description: 'New note awaiting approval'
            })),
            ...recentApprovals.map(note => ({
                type: 'approved',
                title: note.title,
                course: note.course,
                date: note.approvedAt,
                description: 'Note approved'
            }))
        ];
    }
    
    // Sort by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update activity list UI
    const activityList = document.getElementById('activity-list');
    if (activityList) {
        // Clear existing activities
        activityList.innerHTML = '';
        
        // Add new activities (limit to 5)
        activities.slice(0, 5).forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = `activity-item ${activity.type}`;
            
            const icon = activity.type === 'approved' ? 'fa-check-circle' :
                        activity.type === 'pending' ? 'fa-clock' : 'fa-upload';
            const iconColor = activity.type === 'approved' ? 'success' :
                             activity.type === 'pending' ? 'warning' : 'info';
            
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas ${icon} text-${iconColor}"></i>
                </div>
                <div class="activity-content">
                    <h4 class="activity-title">${activity.title}</h4>
                    <p class="activity-description">${activity.description}</p>
                    <span class="activity-meta">${activity.course} • ${formatDate(activity.date)}</span>
                </div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }
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
 * Initialize course progress visualization
 */
function initializeCourseProgress() {
    // This would initialize charts or progress bars
    // For now, we'll just update the stats
    updateCourseStats();
}

/**
 * Setup quick action buttons
 */
function setupQuickActions() {
    // Add event listeners to quick action buttons
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'upload':
                    window.location.href = 'upload.html';
                    break;
                case 'browse':
                    window.location.href = 'browse.html';
                    break;
                case 'my-notes':
                    window.location.href = 'my-notes.html';
                    break;
                case 'profile':
                    window.location.href = 'profile.html';
                    break;
            }
        });
    });
}

/**
 * Initialize dashboard functionality
 */
function initDashboard() {
    document.addEventListener('DOMContentLoaded', function() {
        // Update all dashboard stats
        updateDashboardStats();
        
        // Load recent activity
        loadRecentActivity();
        
        // Initialize course progress
        initializeCourseProgress();
        
        // Setup quick actions
        setupQuickActions();
        
        // Refresh stats every 30 seconds
        setInterval(updateDashboardStats, 30000);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateDashboardStats,
        loadRecentActivity,
        initializeCourseProgress,
        setupQuickActions,
        initDashboard
    };
}