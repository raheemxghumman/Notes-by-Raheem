// Upload functionality for NotesByRaheem.xyz

/**
 * Initialize upload form functionality
 */
function initUploadForm() {
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const fileDropArea = document.getElementById('file-drop-area');
    const filePreview = document.getElementById('file-preview');
    const uploadForm = document.getElementById('upload-form');
    const statusMessage = document.getElementById('status-message');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    let selectedFiles = [];
    
    // Browse button click
    if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Drag and drop events
    if (fileDropArea) {
        fileDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropArea.classList.add('dragover');
        });
        
        fileDropArea.addEventListener('dragleave', () => {
            fileDropArea.classList.remove('dragover');
        });
        
        fileDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropArea.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                handleFileSelect({ target: { files: e.dataTransfer.files } });
            }
        });
    }
    
    // Form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
    
    /**
     * Handle file selection
     */
    function handleFileSelect(event) {
        const files = Array.from(event.target.files);
        
        // Validate files
        const validFiles = files.filter(file => {
            const validTypes = ['application/pdf', 'application/msword', 
                               'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                               'text/plain', 'image/jpeg', 'image/png'];
            const maxSize = 10 * 1024 * 1024; // 10MB
            
            if (!validTypes.includes(file.type)) {
                showStatus('Invalid file type. Please upload PDF, DOC, DOCX, TXT, JPG, or PNG files.', 'error');
                return false;
            }
            
            if (file.size > maxSize) {
                showStatus('File size exceeds 10MB limit.', 'error');
                return false;
            }
            
            return true;
        });
        
        selectedFiles = [...selectedFiles, ...validFiles];
        updateFilePreview();
        
        if (validFiles.length > 0) {
            showStatus(`${validFiles.length} file(s) selected successfully.`, 'success');
        }
    }
    
    /**
     * Update file preview
     */
    function updateFilePreview() {
        if (!filePreview) return;
        
        if (selectedFiles.length === 0) {
            filePreview.innerHTML = '<p class="empty-preview">No files selected</p>';
            return;
        }
        
        filePreview.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas ${getFileIcon(file.type)}"></i>
                    <div class="file-details">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${formatFileSize(file.size)}</span>
                    </div>
                </div>
                <button class="btn-remove-file" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            filePreview.appendChild(fileItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.btn-remove-file').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                selectedFiles.splice(index, 1);
                updateFilePreview();
            });
        });
    }
    
    /**
     * Handle form submission
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        if (selectedFiles.length === 0) {
            showStatus('Please select at least one file to upload.', 'error');
            return;
        }
        
        const courseSelect = document.getElementById('course-select');
        const titleInput = document.getElementById('note-title');
        const descriptionInput = document.getElementById('note-description');
        const visibilitySelect = document.getElementById('visibility');
        
        if (!courseSelect || !courseSelect.value) {
            showStatus('Please select a course.', 'error');
            return;
        }
        
        if (!titleInput || !titleInput.value.trim()) {
            showStatus('Please enter a title for your notes.', 'error');
            return;
        }
        
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
        
        if (!currentUser) {
            showStatus('You must be logged in to upload notes.', 'error');
            return;
        }
        
        // Simulate upload process
        showStatus('Uploading notes...', 'info');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        }
        
        // Simulate API call delay
        setTimeout(() => {
            // Create note object
            const newNote = {
                id: Date.now().toString(),
                title: titleInput.value.trim(),
                description: descriptionInput.value.trim() || 'No description provided',
                course: courseSelect.value,
                files: selectedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                })),
                uploadedBy: currentUser.username,
                uploadedByName: currentUser.name,
                uploadedAt: new Date().toISOString(),
                status: 'pending',
                visibility: visibilitySelect ? visibilitySelect.value : 'public',
                downloads: 0,
                rating: 0
            };
            
            // Save to localStorage
            const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
            notes.push(newNote);
            localStorage.setItem('studentNotes', JSON.stringify(notes));
            
            // Show success message
            showStatus('Notes uploaded successfully! Awaiting admin approval.', 'success');
            
            // Reset form
            resetForm();
            
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Notes';
            }
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
            
        }, 1500);
    }
    
    /**
     * Reset form
     */
    function resetForm() {
        selectedFiles = [];
        updateFilePreview();
        
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.reset();
        }
        
        if (fileInput) {
            fileInput.value = '';
        }
        
        showStatus('', '');
    }
    
    /**
     * Show status message
     */
    function showStatus(message, type) {
        if (!statusMessage) return;
        
        statusMessage.textContent = message;
        statusMessage.className = 'status-message';
        
        if (type) {
            statusMessage.classList.add(type);
        }
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }, 5000);
        }
    }
    
    /**
     * Get file icon based on type
     */
    function getFileIcon(fileType) {
        if (fileType.includes('pdf')) return 'fa-file-pdf';
        if (fileType.includes('word') || fileType.includes('document')) return 'fa-file-word';
        if (fileType.includes('text')) return 'fa-file-alt';
        if (fileType.includes('image')) return 'fa-file-image';
        return 'fa-file';
    }
    
    /**
     * Format file size
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

/**
 * Initialize upload page
 */
function initUploadPage() {
    document.addEventListener('DOMContentLoaded', function() {
        initUploadForm();
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initUploadForm,
        initUploadPage
    };
}