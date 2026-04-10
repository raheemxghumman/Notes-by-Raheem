# File Fixes and Linkage Plan

## Issues Identified

### 1. JavaScript File Issues
- **Missing files**: `js/auth/auth.js` and `js/components/dashboard.js` are referenced but don't exist
- **Path mismatch**: `index.html` references `script.js` but file is at `js/script.js`

### 2. CSS File Issues
- **Missing file**: `css/pages/notes.css` is referenced in `css/main.css` but doesn't exist
- **CSS imports**: All CSS imports in `css/main.css` need verification

### 3. Missing Pages from Proposed Plan
**Student pages missing:**
- `student/my-uploads.html` (called `my-notes.html` in current implementation)
- `student/profile.html`
- `student/settings.html`

**Admin pages missing:**
- `admin/approvals.html`
- `admin/users.html`
- `admin/reports.html`
- `admin/activity.html`

**Owner pages missing:**
- `owner/users.html`
- `owner/settings.html`
- `owner/analytics.html`
- `owner/courses.html`
- `owner/backups.html`

**Public pages missing:**
- `about.html`
- `contact.html`

### 4. HTML File Linkage Issues
- **student/dashboard.html**: References non-existent JavaScript files
- **All dashboard pages**: Have inline JavaScript that should be moved to external files
- **CSS class consistency**: Need to ensure consistent class naming across pages

## Fix Implementation Plan

### Phase 1: Create Missing JavaScript Files
1. Create `js/auth/auth.js` with authentication utilities
2. Create `js/components/dashboard.js` with dashboard-specific functionality
3. Create `js/components/upload.js` for upload functionality
4. Create `js/components/browse.js` for note browsing functionality
5. Create `js/components/admin.js` for admin panel functionality
6. Create `js/components/owner.js` for owner panel functionality

### Phase 2: Fix HTML File References
1. Update `index.html` to reference `js/script.js` instead of `script.js`
2. Update `student/dashboard.html` to use the new JavaScript files
3. Update `student/browse.html` to use external JavaScript
4. Update `student/upload.html` to use external JavaScript
5. Update `admin/dashboard.html` to use external JavaScript
6. Update `owner/dashboard.html` to use external JavaScript

### Phase 3: Create Missing CSS Files
1. Create `css/pages/notes.css` for notes browsing page
2. Verify all CSS imports in `css/main.css` point to existing files
3. Create missing CSS files for new pages

### Phase 4: Create Missing HTML Pages
1. Create basic placeholder pages for all missing pages
2. Ensure consistent navigation and styling
3. Add basic functionality

### Phase 5: Test and Validate
1. Test all page links
2. Test authentication flow
3. Test CSS styling
4. Test JavaScript functionality

## Detailed File Specifications

### js/auth/auth.js
```javascript
// Authentication utilities including:
// - checkAuth()
// - hasRole(role)
// - requireAuth(requiredRole)
// - logout()
// - getCurrentUserName()
// - updateUserNameInUI()
// - initAuth(requiredRole)
```

### js/components/dashboard.js
```javascript
// Dashboard-specific functionality including:
// - updateDashboardStats()
// - loadRecentActivity()
// - initializeCourseProgress()
// - setupQuickActions()
```

### css/pages/notes.css
```css
/* Styles for notes browsing page */
.notes-grid { /* ... */ }
.note-card { /* ... */ }
.filter-section { /* ... */ }
/* etc. */
```

## Next Steps
1. Switch to Code mode to implement these fixes
2. Create all missing JavaScript files
3. Update HTML file references
4. Create missing CSS files
5. Create placeholder pages for missing HTML files
6. Test the complete application

## Success Criteria
- All JavaScript file references resolve correctly
- All CSS imports work without 404 errors
- All pages from the proposed plan exist (even as placeholders)
- Authentication works correctly across all pages
- Consistent styling across all pages