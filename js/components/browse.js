// Note browsing functionality for NotesByRaheem.xyz

/**
 * Initialize browse page functionality
 */
function initBrowsePage() {
    // Load notes on page load
    loadNotes();
    
    // Setup filters
    setupFilters();
    
    // Setup search
    setupSearch();
    
    // Setup pagination
    setupPagination();
}

/**
 * Load notes from localStorage
 */
function loadNotes(filter = {}, sort = 'newest') {
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    
    // Filter notes (only show approved notes for students)
    let filteredNotes = notes.filter(note => note.status === 'approved');
    
    // Apply course filter
    if (filter.course && filter.course !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.course === filter.course);
    }
    
    // Apply search filter
    if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.description.toLowerCase().includes(searchTerm) ||
            note.uploadedByName.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    filteredNotes = sortNotes(filteredNotes, sort);
    
    // Update UI
    updateNotesGrid(filteredNotes);
    updatePagination(filteredNotes.length);
}

/**
 * Sort notes based on criteria
 */
function sortNotes(notes, sortBy) {
    const sortedNotes = [...notes];
    
    switch(sortBy) {
        case 'newest':
            return sortedNotes.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        case 'oldest':
            return sortedNotes.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
        case 'popular':
            return sortedNotes.sort((a, b) => b.downloads - a.downloads);
        case 'rating':
            return sortedNotes.sort((a, b) => b.rating - a.rating);
        case 'title':
            return sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sortedNotes;
    }
}

/**
 * Update notes grid UI
 */
function updateNotesGrid(notes) {
    const notesGrid = document.getElementById('notes-grid');
    if (!notesGrid) return;
    
    // Clear existing notes
    notesGrid.innerHTML = '';
    
    if (notes.length === 0) {
        notesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No notes found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    // Add note cards
    notes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesGrid.appendChild(noteCard);
    });
}

/**
 * Create a note card element
 */
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.setAttribute('data-note-id', note.id);
    
    // Get course info
    const courseInfo = getCourseInfo(note.course);
    
    // Format date
    const formattedDate = formatDate(note.uploadedAt);
    
    // Count pages/files
    const fileCount = note.files ? note.files.length : 0;
    
    card.innerHTML = `
        <div class="note-header">
            <span class="note-course-badge" style="background-color: ${courseInfo.color}">
                <i class="${courseInfo.icon}"></i> ${courseInfo.name}
            </span>
            <span class="note-status approved">Approved</span>
        </div>
        <div class="note-body">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-description">${note.description}</p>
            <div class="note-meta">
                <span class="note-author">
                    <i class="fas fa-user"></i> ${note.uploadedByName}
                </span>
                <span class="note-pages">
                    <i class="fas fa-file"></i> ${fileCount} file${fileCount !== 1 ? 's' : ''}
                </span>
                <span class="note-date">
                    <i class="fas fa-calendar"></i> ${formattedDate}
                </span>
            </div>
        </div>
        <div class="note-footer">
            <div class="note-rating">
                <div class="stars">
                    ${generateStarRating(note.rating)}
                </div>
                <span class="rating-count">(${note.rating.toFixed(1)})</span>
            </div>
            <div class="note-stats">
                <span class="stat">
                    <i class="fas fa-download"></i> ${note.downloads || 0}
                </span>
                <span class="stat">
                    <i class="fas fa-eye"></i> ${note.views || 0}
                </span>
            </div>
            <div class="note-actions">
                <button class="btn-preview" data-note-id="${note.id}">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button class="btn-download" data-note-id="${note.id}">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const previewBtn = card.querySelector('.btn-preview');
    const downloadBtn = card.querySelector('.btn-download');
    
    if (previewBtn) {
        previewBtn.addEventListener('click', () => previewNote(note.id));
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => downloadNote(note.id));
    }
    
    return card;
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
 * Generate star rating HTML
 */
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

/**
 * Setup filter controls
 */
function setupFilters() {
    const courseFilter = document.getElementById('course-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (courseFilter) {
        courseFilter.addEventListener('change', function() {
            const filter = {
                course: this.value
            };
            loadNotes(filter, getCurrentSort());
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            loadNotes(getCurrentFilter(), this.value);
        });
    }
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        // Search on Enter key
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        
        // Clear search when input is cleared
        searchInput.addEventListener('input', function() {
            if (!this.value.trim()) {
                performSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

/**
 * Perform search
 */
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    const filter = getCurrentFilter();
    filter.search = searchTerm;
    
    loadNotes(filter, getCurrentSort());
}

/**
 * Get current filter values
 */
function getCurrentFilter() {
    const courseFilter = document.getElementById('course-filter');
    const searchInput = document.getElementById('search-input');
    
    return {
        course: courseFilter ? courseFilter.value : 'all',
        search: searchInput ? searchInput.value.trim() : ''
    };
}

/**
 * Get current sort value
 */
function getCurrentSort() {
    const sortFilter = document.getElementById('sort-filter');
    return sortFilter ? sortFilter.value : 'newest';
}

/**
 * Setup pagination
 */
function setupPagination() {
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrevPage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextPage);
    }
}

/**
 * Update pagination UI
 */
function updatePagination(totalNotes) {
    const notesPerPage = 9;
    const totalPages = Math.ceil(totalNotes / notesPerPage);
    const currentPage = 1; // For now, we'll implement simple pagination
    
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    const pageNumbers = document.querySelector('.page-numbers');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    if (pageNumbers) {
        pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

/**
 * Go to previous page
 */
function goToPrevPage() {
    // Implement pagination logic
    console.log('Previous page');
}

/**
 * Go to next page
 */
function goToNextPage() {
    // Implement pagination logic
    console.log('Next page');
}

/**
 * Preview a note
 */
function previewNote(noteId) {
    // In a real app, this would open a preview modal
    alert(`Previewing note ${noteId}. This would open a preview modal in a real application.`);
}

/**
 * Download a note
 */
function downloadNote(noteId) {
    // Get note from localStorage
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const note = notes.find(n => n.id === noteId);
    
    if (!note) {
        alert('Note not found.');
        return;
    }
    
    // Update download count
    note.downloads = (note.downloads || 0) + 1;
    localStorage.setItem('studentNotes', JSON.stringify(notes));
    
    // Show download message
    alert(`Downloading "${note.title}". In a real application, this would start the file download.`);
    
    // Refresh the notes grid to update download count
    loadNotes(getCurrentFilter(), getCurrentSort());
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initBrowsePage,
        loadNotes,
        previewNote,
        downloadNote
    };
}