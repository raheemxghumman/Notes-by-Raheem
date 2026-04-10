// NotesByRaheem.xyz - Dynamic Functionality

// Course data for 4th semester
const courses = [
    {
        id: 'multivariable-calculus',
        name: 'Multi-variable Calculus',
        description: 'Advanced calculus topics including partial derivatives, multiple integrals, vector calculus, and applications.',
        icon: 'fas fa-calculator',
        color: '#4361ee',
        notesCount: 0
    },
    {
        id: 'software-engineering',
        name: 'Software Engineering',
        description: 'Software development methodologies, requirements analysis, design patterns, testing, and project management.',
        icon: 'fas fa-laptop-code',
        color: '#7209b7',
        notesCount: 0
    },
    {
        id: 'computer-networks',
        name: 'Computer Networks',
        description: 'Network architectures, protocols, TCP/IP, routing, switching, network security, and wireless networks.',
        icon: 'fas fa-network-wired',
        color: '#f72585',
        notesCount: 0
    },
    {
        id: 'civics-community',
        name: 'Civics and Community Engagement',
        description: 'Civic responsibilities, community development, social issues, and ethical engagement in society.',
        icon: 'fas fa-hands-helping',
        color: '#4cc9f0',
        notesCount: 0
    },
    {
        id: 'visual-programming',
        name: 'Visual Programming',
        description: 'GUI development, event-driven programming, visual design tools, and desktop application development.',
        icon: 'fas fa-palette',
        color: '#f8961e',
        notesCount: 0
    },
    {
        id: 'computer-organization',
        name: 'Computer Organization and Assembly Language',
        description: 'Computer architecture, CPU design, memory hierarchy, assembly language programming, and I/O systems.',
        icon: 'fas fa-microchip',
        color: '#f94144',
        notesCount: 0
    }
];

// Sample notes data (in a real app, this would come from a backend)
let notes = [
    {
        id: 1,
        title: 'Calculus Chapter 3: Partial Derivatives',
        description: 'Complete notes on partial derivatives, chain rule, and gradient vectors.',
        course: 'multivariable-calculus',
        uploader: 'Raheem',
        date: '2023-10-15',
        fileName: 'calc_ch3.pdf',
        fileType: 'pdf',
        shares: 12,
        downloads: 25
    },
    {
        id: 2,
        title: 'Software Engineering Requirements',
        description: 'Lecture notes on requirement gathering techniques and SRS documentation.',
        course: 'software-engineering',
        uploader: 'Ali',
        date: '2023-10-10',
        fileName: 'se_requirements.docx',
        fileType: 'docx',
        shares: 8,
        downloads: 18
    },
    {
        id: 3,
        title: 'Network Protocols Overview',
        description: 'Summary of TCP/IP, UDP, HTTP, and other essential network protocols.',
        course: 'computer-networks',
        uploader: 'Sara',
        date: '2023-10-05',
        fileName: 'network_protocols.pptx',
        fileType: 'pptx',
        shares: 15,
        downloads: 32
    }
];

// Website statistics
let stats = {
    totalNotes: 0,
    totalShares: 0,
    pageViews: 124,
    userCount: 45
};

// DOM Elements
const courseGrid = document.querySelector('.course-grid');
const notesGrid = document.querySelector('.notes-grid');
const recentNotesContainer = document.querySelector('.recent-notes');
const filterButtonsContainer = document.querySelector('.filter-buttons');
const searchInput = document.getElementById('search-notes');
const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const fileNameDisplay = document.getElementById('file-name');
const totalNotesElement = document.getElementById('total-notes');
const totalSharesElement = document.getElementById('total-shares');
const pageViewsElement = document.getElementById('page-views');
const shareCountElement = document.getElementById('share-count');
const userCountElement = document.getElementById('user-count');
const websiteUrlInput = document.getElementById('website-url');
const copyUrlButton = document.getElementById('copy-url');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Update stats
    updateStats();
    
    // Load courses
    renderCourses();
    
    // Load notes
    renderNotes();
    renderRecentNotes();
    renderFilterButtons();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Update note counts for each course
    updateCourseNoteCounts();
});

// Update website statistics
function updateStats() {
    stats.totalNotes = notes.length;
    stats.totalShares = notes.reduce((sum, note) => sum + note.shares, 0);
    
    totalNotesElement.textContent = stats.totalNotes;
    totalSharesElement.textContent = stats.totalShares;
    pageViewsElement.textContent = stats.pageViews;
    shareCountElement.textContent = stats.totalShares;
    userCountElement.textContent = stats.userCount;
}

// Render course cards
function renderCourses() {
    courseGrid.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = `course-card course-${course.id}`;
        
        courseCard.innerHTML = `
            <div class="course-icon" style="background-color: ${course.color};">
                <i class="${course.icon}"></i>
            </div>
            <h3>${course.name}</h3>
            <p class="course-description">${course.description}</p>
            <div class="course-stats">
                <div class="course-stat">
                    <span class="course-stat-value" id="notes-count-${course.id}">${course.notesCount}</span>
                    <span class="course-stat-label">Notes</span>
                </div>
                <div class="course-stat">
                    <span class="course-stat-value">4th</span>
                    <span class="course-stat-label">Semester</span>
                </div>
            </div>
            <button class="btn btn-secondary view-course-btn" data-course="${course.id}">
                <i class="fas fa-book-open"></i> View Notes
            </button>
        `;
        
        courseGrid.appendChild(courseCard);
    });
    
    // Add event listeners to course buttons
    document.querySelectorAll('.view-course-btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');
            filterNotesByCourse(courseId);
            
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === courseId) {
                    btn.classList.add('active');
                }
            });
            
            // Scroll to notes section
            document.getElementById('notes').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Render all notes
function renderNotes(filteredNotes = notes) {
    notesGrid.innerHTML = '';
    
    if (filteredNotes.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.id = 'empty-notes';
        emptyState.innerHTML = `
            <i class="fas fa-sticky-note"></i>
            <h3>No notes found</h3>
            <p>Try a different search or upload the first note!</p>
        `;
        notesGrid.appendChild(emptyState);
        return;
    }
    
    filteredNotes.forEach(note => {
        const course = courses.find(c => c.id === note.course);
        const noteCard = document.createElement('div');
        noteCard.className = `note-card note-${note.course}`;
        
        noteCard.innerHTML = `
            <div class="note-header">
                <span class="note-course">${course ? course.name : note.course}</span>
                <span class="note-date">${formatDate(note.date)}</span>
            </div>
            <h3 class="note-title">${note.title}</h3>
            <p class="note-description">${note.description}</p>
            <div class="note-footer">
                <div class="note-uploader">
                    <i class="fas fa-user"></i> ${note.uploader}
                </div>
                <div class="note-actions">
                    <button class="note-action-btn share-btn" data-note-id="${note.id}" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="note-action-btn download-btn" data-note-id="${note.id}" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="note-action-btn view-btn" data-note-id="${note.id}" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        
        notesGrid.appendChild(noteCard);
    });
    
    // Add event listeners to note action buttons
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function() {
            const noteId = parseInt(this.getAttribute('data-note-id'));
            shareNote(noteId);
        });
    });
    
    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', function() {
            const noteId = parseInt(this.getAttribute('data-note-id'));
            downloadNote(noteId);
        });
    });
    
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const noteId = parseInt(this.getAttribute('data-note-id'));
            viewNote(noteId);
        });
    });
}

// Render recent notes in upload section
function renderRecentNotes() {
    recentNotesContainer.innerHTML = '';
    
    // Get 3 most recent notes
    const recentNotes = [...notes]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    recentNotes.forEach(note => {
        const course = courses.find(c => c.id === note.course);
        const recentNote = document.createElement('div');
        recentNote.className = 'recent-note';
        
        recentNote.innerHTML = `
            <h4>${note.title}</h4>
            <p><i class="fas fa-book"></i> ${course ? course.name : note.course}</p>
            <p><i class="fas fa-user"></i> ${note.uploader} • ${formatDate(note.date)}</p>
        `;
        
        recentNotesContainer.appendChild(recentNote);
    });
}

// Render filter buttons
function renderFilterButtons() {
    // Clear existing buttons except "All Courses"
    const allCoursesBtn = document.querySelector('.filter-btn[data-filter="all"]');
    filterButtonsContainer.innerHTML = '';
    filterButtonsContainer.appendChild(allCoursesBtn);
    
    // Add course-specific filter buttons
    courses.forEach(course => {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'filter-btn';
        filterBtn.setAttribute('data-filter', course.id);
        filterBtn.textContent = course.name;
        filterButtonsContainer.appendChild(filterBtn);
    });
    
    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter notes
            const filter = this.getAttribute('data-filter');
            if (filter === 'all') {
                renderNotes();
            } else {
                const filteredNotes = notes.filter(note => note.course === filter);
                renderNotes(filteredNotes);
            }
        });
    });
}

// Update note counts for each course
function updateCourseNoteCounts() {
    courses.forEach(course => {
        course.notesCount = notes.filter(note => note.course === course.id).length;
        const countElement = document.getElementById(`notes-count-${course.id}`);
        if (countElement) {
            countElement.textContent = course.notesCount;
        }
    });
}

// Filter notes by course
function filterNotesByCourse(courseId) {
    if (courseId === 'all') {
        renderNotes();
    } else {
        const filteredNotes = notes.filter(note => note.course === courseId);
        renderNotes(filteredNotes);
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

// Setup event listeners
function setupEventListeners() {
    // File input display
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });
    
    // Upload form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const courseSelect = document.getElementById('course-select');
        const noteTitle = document.getElementById('note-title');
        const noteDescription = document.getElementById('note-description');
        const uploaderName = document.getElementById('uploader-name');
        
        if (!fileInput.files.length) {
            alert('Please select a file to upload.');
            return;
        }
        
        // Create new note object
        const newNote = {
            id: notes.length + 1,
            title: noteTitle.value,
            description: noteDescription.value,
            course: courseSelect.value,
            uploader: uploaderName.value || 'Anonymous',
            date: new Date().toISOString().split('T')[0],
            fileName: fileInput.files[0].name,
            fileType: fileInput.files[0].name.split('.').pop(),
            shares: 0,
            downloads: 0
        };
        
        // Add to notes array
        notes.unshift(newNote);
        
        // Update UI
        renderNotes();
        renderRecentNotes();
        updateCourseNoteCounts();
        updateStats();
        
        // Show success message
        alert(`"${newNote.title}" uploaded successfully!`);
        
        // Reset form
        uploadForm.reset();
        fileNameDisplay.textContent = 'No file chosen';
        
        // Scroll to show the new note
        document.getElementById('notes').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            // If search is empty, show all notes
            const activeFilter = document.querySelector('.filter-btn.active');
            if (activeFilter) {
                const filter = activeFilter.getAttribute('data-filter');
                if (filter === 'all') {
                    renderNotes();
                } else {
                    const filteredNotes = notes.filter(note => note.course === filter);
                    renderNotes(filteredNotes);
                }
            } else {
                renderNotes();
            }
            return;
        }
        
        // Filter notes by search term
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.description.toLowerCase().includes(searchTerm) ||
            note.uploader.toLowerCase().includes(searchTerm)
        );
        
        renderNotes(filteredNotes);
    });
    
    // Copy URL functionality
    copyUrlButton.addEventListener('click', function() {
        websiteUrlInput.select();
        websiteUrlInput.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            navigator.clipboard.writeText(websiteUrlInput.value);
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            document.execCommand('copy');
            alert('URL copied to clipboard!');
        }
    });
    
    // Share buttons functionality
    document.querySelectorAll('.share-btn.whatsapp').forEach(button => {
        button.addEventListener('click', function() {
            shareViaWhatsApp();
        });
    });
    
    document.querySelectorAll('.share-btn.email').forEach(button => {
        button.addEventListener('click', function() {
            shareViaEmail();
        });
    });
    
    document.querySelectorAll('.share-btn.telegram').forEach(button => {
        button.addEventListener('click', function() {
            shareViaTelegram();
        });
    });
    
    document.querySelectorAll('.share-btn.copy-link').forEach(button => {
        button.addEventListener('click', function() {
            copyWebsiteUrl();
        });
    });
    
    // Feedback form
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('feedback-name').value;
            const email = document.getElementById('feedback-email').value;
            const message = document.getElementById('feedback-message').value;
            
            if (!message.trim()) {
                alert('Please enter your feedback message.');
                return;
            }
            
            alert(`Thank you for your feedback, ${name || 'Anonymous'}! We appreciate your input.`);
            feedbackForm.reset();
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

// Initialize mobile menu
function initMobileMenu() {
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        }
    });
}

// Share note functionality
function shareNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Increment share count
    note.shares++;
    
    // Update stats
    updateStats();
    
    // Create share URL
    const shareUrl = `https://notesbyraheem.xyz/note/${noteId}`;
    const shareText = `Check out this note: "${note.title}" on NotesByRaheem.xyz`;
    
    // Show share options
    if (navigator.share) {
        navigator.share({
            title: note.title,
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareText} - ${shareUrl}`).then(() => {
            alert('Note link copied to clipboard! Share it with your classmates.');
        });
    }
}

// Download note (simulated)
function downloadNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Increment download count
    note.downloads++;
    
    // Show download message
    alert(`Downloading "${note.title}"...\n\nIn a real application, this would download the file.`);
    
    // Update UI if needed
    updateStats();
}

// View note (simulated)
function viewNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Show view message
    alert(`Viewing "${note.title}"\n\nCourse: ${note.course}\nUploaded by: ${note.uploader}\nDate: ${formatDate(note.date)}\n\nIn a real application, this would open the file in a viewer.`);
}

// Share via WhatsApp
function shareViaWhatsApp() {
    const url = encodeURIComponent(websiteUrlInput.value);
    const text = encodeURIComponent('Check out NotesByRaheem.xyz - A platform to share 4th semester notes with classmates!');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    
    // Update share stats
    stats.pageViews++;
    updateStats();
}

// Share via Email
function shareViaEmail() {
    const subject = encodeURIComponent('NotesByRaheem.xyz - 4th Semester Notes Sharing Platform');
    const body = encodeURIComponent(`Hi,\n\nI found this great platform for sharing 4th semester notes: ${websiteUrlInput.value}\n\nCheck it out and upload your notes too!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    
    // Update share stats
    stats.pageViews++;
    updateStats();
}

// Share via Telegram
function shareViaTelegram() {
    const url = encodeURIComponent(websiteUrlInput.value);
    const text = encodeURIComponent('Check out NotesByRaheem.xyz - A platform to share 4th semester notes with classmates!');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    
    // Update share stats
    stats.pageViews++;
    updateStats();
}

// Copy website URL
function copyWebsiteUrl() {
    websiteUrlInput.select();
    websiteUrlInput.setSelectionRange(0, 99999);
    
    try {
        navigator.clipboard.writeText(websiteUrlInput.value);
        alert('Website URL copied to clipboard!');
        
        // Update share stats
        stats.pageViews++;
        updateStats();
    } catch (err) {
        document.execCommand('copy');
        alert('Website URL copied to clipboard!');
    }
}

// Add some sample notes on first load if empty
if (notes.length === 0) {
    // Add a few more sample notes
    notes.push(
        {
            id: 4,
            title: 'Community Engagement Strategies',
            description: 'Effective methods for community involvement and civic participation.',
            course: 'civics-community',
            uploader: 'Ahmed',
            date: '2023-09-28',
            fileName: 'community_engagement.pdf',
            fileType: 'pdf',
            shares: 5,
            downloads: 12
        },
        {
            id: 5,
            title: 'Visual Studio GUI Design',
            description: 'Creating user interfaces with drag-and-drop tools in Visual Studio.',
            course: 'visual-programming',
            uploader: 'Fatima',
            date: '2023-09-25',
            fileName: 'vs_gui_design.pptx',
            fileType: 'pptx',
            shares: 7,
            downloads: 20
        },
        {
            id: 6,
            title: 'Assembly Language Basics',
            description: 'Introduction to x86 assembly language programming and CPU registers.',
            course: 'computer-organization',
            uploader: 'Raheem',
            date: '2023-09-20',
            fileName: 'assembly_basics.docx',
            fileType: 'docx',
            shares: 10,
            downloads: 28
        }
    );
}

// Update course note counts initially
updateCourseNoteCounts();

// Add animation to course cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe course cards
document.querySelectorAll('.course-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Observe note cards
document.querySelectorAll('.note-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Update page views periodically (simulated)
setInterval(() => {
    stats.pageViews += Math.floor(Math.random() * 5) + 1;
    updateStats();
}, 30000); // Every 30 seconds