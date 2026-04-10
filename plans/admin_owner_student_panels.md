# Admin, Owner & Student Panels Design

## Overview
Three distinct user interfaces tailored to each role's responsibilities and permissions.

## Student Panel Design

### Dashboard (`student/dashboard.html`)
**Layout**: Card-based with sidebar navigation

**Components**:
1. **Welcome Header**
   - Student name and profile picture
   - Current semester (4th) and roll number
   - Quick stats badge

2. **Quick Stats Cards** (3-column grid)
   ```
   ┌─────────────────┬─────────────────┬─────────────────┐
   │ Notes Uploaded  │ Notes Approved  │ Notes Downloaded│
   │ 12              │ 8               │ 24              │
   └─────────────────┴─────────────────┴─────────────────┘
   ```

3. **Recent Activity Feed**
   - Timeline of recent actions
   - Upload status updates
   - System notifications
   - New note alerts from followed courses

4. **Course Progress**
   - Bar chart showing notes per course
   - Color-coded by course
   - Click to browse course notes

5. **Quick Actions**
   - "Upload New Note" button (primary)
   - "Browse Notes" button
   - "View My Uploads" button
   - "Edit Profile" button

6. **Pending Approvals Alert**
   - Shows count of pending uploads
   - Links to My Uploads page
   - Status indicators

### Browse Notes (`student/browse.html`)
**Layout**: Filter sidebar + main content grid

**Components**:
1. **Search & Filter Panel** (Left sidebar)
   - Search input with auto-suggest
   - Course filter (checkboxes with colors)
   - File type filter (PDF, DOCX, PPTX, etc.)
   - Date range picker
   - Sort options (Newest, Most Downloaded, Highest Rated)
   - Clear filters button

2. **Notes Grid** (Main content)
   - Responsive card grid (3 columns desktop, 2 tablet, 1 mobile)
   - Each card shows:
     - Course badge with color
     - Note title (truncated)
     - Uploader name and date
     - Preview snippet
     - Download count and rating
     - Action buttons (Download, Preview, Share)

3. **Pagination/Infinite Scroll**
   - Load more button or auto-scroll
   - Results count display
   - Page navigation

4. **Empty State**
   - Illustration when no results
   - Suggested search terms
   - Link to upload first note

### Upload Notes (`student/upload.html`)
**Layout**: Multi-step wizard form

**Step 1: Select Course**
- Course cards with descriptions
- Color-coded by course
- Required course selection

**Step 2: Upload File**
- Drag & drop area
- File type restrictions display
- Size limit indicator (10MB)
- Preview for supported formats
- Remove/replace file option

**Step 3: Add Details**
- Title input (with character counter)
- Description textarea (Markdown support)
- Tags input (auto-complete from course)
- Visibility options (when approved)

**Step 4: Review & Submit**
- Summary of all information
- File preview
- Edit buttons for each section
- Submit for approval button
- Save as draft option

**Progress Indicator**
- Step tracker at top
- Visual feedback for current step
- Validation errors highlighted

### My Uploads (`student/my-uploads.html`)
**Layout**: Tabbed interface with statistics

**Tabs**:
1. **All Uploads** (default)
2. **Pending Approval** (orange badge)
3. **Approved** (green badge)
4. **Rejected** (red badge)

**Components per Tab**:
1. **Statistics Bar**
   - Total uploads count
   - Approval rate percentage
   - Average approval time

2. **Uploads Table**
   - Note title with link
   - Course and upload date
   - Status badge with icon
   - Actions column:
     - View details
     - Edit (if pending)
     - Delete (if pending)
     - Re-upload (if rejected)

3. **Status Details Modal**
   - Opens when clicking status
   - Shows approval/rejection timeline
   - Admin comments (if rejected)
   - Option to appeal rejection

4. **Bulk Actions**
   - Select multiple uploads
   - Delete selected (pending only)
   - Export list as CSV

### Profile (`student/profile.html`)
**Layout**: Two-column settings page

**Left Column: Personal Information**
- Profile picture upload with preview
- Display name (read-only)
- Roll number (read-only)
- Email address (editable with verification)
- Semester (4th, read-only)

**Right Column: Account Settings**
1. **Security**
   - Password change request button
   - Last password change date
   - Active sessions list
   - Log out other sessions button

2. **Preferences**
   - Email notification toggles
   - Default course filter
   - Theme preference (light/dark)
   - Language selection

3. **Data & Privacy**
   - Download personal data button
   - Account deletion request
   - Privacy settings

4. **Statistics**
   - Account creation date
   - Total login count
   - Last login date and IP
   - Upload/download history

## Admin Panel Design

### Dashboard (`admin/dashboard.html`)
**Layout**: Metrics-focused with action cards

**Components**:
1. **Header Alert Bar**
   - Pending approvals count (highlighted)
   - System status indicators
   - Quick action buttons

2. **Key Metrics Grid** (2x2)
   ```
   ┌─────────────────┬─────────────────┐
   │ Pending Reviews │ Today's Uploads │
   │ 15              │ 8               │
   ├─────────────────┼─────────────────┤
   │ Approval Rate   │ Active Students │
   │ 92%             │ 48              │
   └─────────────────┴─────────────────┘
   ```

3. **Recent Activity Timeline**
   - Student uploads (last 24 hours)
   - Admin actions (approvals/rejections)
   - System events
   - Filter by user or action type

4. **Quick Approval Queue**
   - List of 5 oldest pending notes
   - One-click approve/reject buttons
   - Links to full approval page

5. **Course Distribution Chart**
   - Pie chart of notes by course
   - Hover for counts
   - Click to filter approvals by course

### Pending Approvals (`admin/approvals.html`)
**Layout**: Split-pane review interface

**Left Pane: Approval Queue**
- Sortable table of pending notes
- Columns: Title, Course, Uploader, Date, File Type
- Batch selection checkbox
- Filter by course, date, file type
- Search within pending notes

**Right Pane: Note Review** (activates on selection)
1. **Note Preview**
   - Embedded PDF viewer
   - Image gallery for image files
   - Text preview for documents
   - Download original file button

2. **Note Details**
   - Title and description
   - Uploader information with link to profile
   - Upload date and file size
   - Previous versions (if any)

3. **Approval Actions**
   - **Approve Button** (green, primary)
   - **Reject Button** (red, with reason dropdown)
   - **Request Revision** (yellow, sends message to student)
   - **Skip** (moves to next, marks as reviewed later)

4. **Rejection Reasons** (predefined)
   - Poor quality/content
   - Wrong course/category
   - Duplicate content
   - Copyright violation
   - Inappropriate content
   - Other (with custom text)

5. **Approval History**
   - Previous decisions on similar notes
   - Same uploader's history
   - Course-specific guidelines

**Bulk Actions Bar** (sticky bottom)
- Select all/none
- Bulk approve selected
- Bulk reject with common reason
- Export selection

### User Management (`admin/users.html`)
**Layout**: Searchable user directory

**Components**:
1. **Search & Filter Bar**
   - Search by name, username, roll number
   - Filter by activity status (active/inactive)
   - Filter by upload count ranges
   - Sort options

2. **User Cards Grid**
   - Profile picture and name
   - Username and roll number
   - Upload stats (total/approved)
   - Last login date
   - Activity status badge
   - Quick actions (View Profile, Deactivate)

3. **User Detail View** (modal/separate page)
   - Complete profile information
   - Upload history with status
   - Activity log (last 50 actions)
   - Notes downloaded history
   - Admin actions:
     - Send message
     - Temporary deactivation
     - Flag for owner review

4. **Statistics Overview**
   - Total active students
   - New students this month
   - Top uploaders list
   - Inactive accounts count

### Reports (`admin/reports.html`)
**Layout**: Dashboard with export options

**Report Types**:
1. **Upload Activity Report**
   - Daily/weekly/monthly upload trends
   - Course-wise distribution
   - Approval/rejection rates over time
   - Peak upload times

2. **User Engagement Report**
   - Active vs inactive users
   - Login frequency distribution
   - Download patterns
   - Retention metrics

3. **Content Quality Report**
   - Average approval time
   - Rejection reasons breakdown
   - Top-rated notes
   - Most downloaded content

4. **System Performance Report**
   - Server response times
   - Storage usage by file type
   - Bandwidth consumption
   - Error rates

**Export Options**:
- Date range selection
- Report format (PDF, CSV, Excel)
- Email report to self
- Schedule recurring reports

## Owner Panel Design

### Dashboard (`owner/dashboard.html`)
**Layout**: Enterprise dashboard with widgets

**Widget Grid** (3x3 customizable):
1. **System Health** (critical)
   - Server status (up/down)
   - Database connection
   - Storage usage (with warning levels)
   - Backup status (last successful)

2. **User Statistics** (expanded)
   - Total users by role
   - New users this week
   - Active/inactive ratio
   - Login success rate

3. **Content Overview**
   - Total notes by status
   - Storage by file type
   - Growth trends chart
   - Top courses by content

4. **Financial Metrics** (if applicable)
   - Server costs
   - Storage costs
   - Bandwidth usage
   - Cost per user

5. **Security Monitor**
   - Failed login attempts
   - Suspicious activities
   - Security patch status
   - SSL certificate expiry

6. **Performance Metrics**
   - Page load times
   - API response times
   - Concurrent users
   - Error rates

7. **Quick Actions Panel**
   - Create new user
   - Run backup
   - Clear cache
   - View logs
   - System settings

8. **Recent Alerts**
   - System warnings
   - User reports
   - Security events
   - Maintenance reminders

9. **Calendar & Schedule**
   - Upcoming maintenance
   - Backup schedule
   - User events (exams, holidays)
   - System updates

### User Management (`owner/users.html`)
**Layout**: Advanced user administration

**Features**:
1. **User Creation Wizard**
   - Batch user creation (upload CSV)
   - Individual user creation form
   - Role assignment with permissions
   - Automatic username generation
   - Secure password generation
   - Email notification template

2. **Advanced User Table**
   - All user fields editable inline
   - Bulk operations (activate, deactivate, delete)
   - Role change with confirmation
   - Password reset with logging
   - Export full user database

3. **User Import/Export**
   - CSV template download
   - Import validation with preview
   - Conflict resolution (duplicate usernames)
   - Import history and logs

4. **Permission Management**
   - Custom role creation
   - Fine-grained permission settings
   - Permission inheritance
   - Role assignment history

5. **Audit Log**
   - All user changes tracked
   - Change comparison (before/after)
   - Revert changes capability
   - Export audit trail

### System Settings (`owner/settings.html`)
**Layout**: Categorized settings with live preview

**Categories**:
1. **General Settings**
   - Site name, logo, favicon
   - Color theme and branding
   - Default language
   - Timezone and date format

2. **Upload Settings**
   - Maximum file size
   - Allowed file types
   - Storage location
   - File naming convention
   - Automatic virus scanning toggle

3. **Security Settings**
   - Session timeout duration
   - Maximum login attempts
   - Password policy settings
   - Two-factor authentication
   - IP whitelist/blacklist

4. **Email Settings**
   - SMTP configuration
   - Email templates
   - Notification preferences
   - Test email functionality

5. **Maintenance Settings**
   - Maintenance mode toggle
   - Custom maintenance message
   - Scheduled maintenance windows
   - Auto-update settings

6. **Backup Settings**
   - Backup frequency
   - Retention policy
   - Backup location
   - Encryption settings
   - Test restore functionality

**Settings Features**:
- Live preview of changes
- Validation for all inputs
- Reset to defaults option
- Export/import settings
- Settings change history

### Analytics (`owner/analytics.html`)
**Layout**: Business intelligence dashboard

**Analytics Modules**:
1. **User Behavior Analytics**
   - User journey mapping
   - Feature usage heatmaps
   - Conversion funnels (upload → approval → download)
   - Cohort analysis by join date

2. **Content Performance**
   - Note quality scoring
   - Download-to-upload ratio
   - Popularity trends prediction
   - Content gap analysis

3. **System Performance**
   - Resource usage forecasting
   - Growth projections
   - Cost optimization suggestions
   - Scalability analysis

4. **Business Metrics** (if monetized)
   - Revenue tracking
   - Cost per acquisition
   - Lifetime value calculation
   - ROI analysis

**Advanced Features**:
- Custom report builder
- SQL query interface (advanced users)
- API for external analytics
- Automated insights generation
- Anomaly detection alerts

### Course Management (`owner/courses.html`)
**Layout**: Course catalog administration

**Components**:
1. **Course List with Editing**
   - Inline editing for all fields
   - Drag-and-drop reordering
   - Bulk status change (active/inactive)
   - Course duplication

2. **Course Creation Form**
   - Course code and name
   - Detailed description (WYSIWYG editor)
   - Color scheme picker
   - Icon selection from library
   - Semester assignment
   - Prerequisite courses
   - Learning objectives

3. **Course Statistics**
   - Notes count over time
   - Student engagement metrics
   - Quality scores
   - Most active uploaders

4. **Course Content Review**
   - Browse all notes in course
   - Quality assessment tools
   - Content gap identification
   - Featured notes selection

5. **Bulk Operations**
   - Merge duplicate courses
   - Archive old courses
   - Import course catalog
   - Export course data

### Backup Management (`owner/backups.html`)
**Layout**: Backup control center

**Features**:
1. **Backup Status Dashboard**
   - Last successful backup
   - Next scheduled backup
   - Storage usage
   - Backup health score

2. **Manual Backup Controls**
   - Full system backup button
   - Database-only backup
   - File-only backup
   - Incremental backup

3. **Backup History**
   - List of all backups with details
   - Size and duration information
   - Success/failure status
   - Download/delete options

4. **Restore Interface**
   - Select backup to restore
   - Preview restore contents
   - Dry run simulation
   - Actual restore with confirmation

5. **Backup Configuration**
   - Schedule settings (cron-like interface)
   - Retention policy rules
   - Storage destinations (local, cloud, FTP)
   - Encryption settings
   - Notification preferences

6. **Disaster Recovery**
   - Recovery point objective (RPO) display
   - Recovery time objective (RTO) estimation
   - Disaster recovery plan viewer
   - Emergency contact information

## Common Design Elements Across All Panels

### Navigation Structure
- **Top Navigation Bar**: Logo, user menu, notifications, search
- **Side Navigation**: Role-specific menu items with icons
- **Breadcrumbs**: Page hierarchy navigation
- **Quick Action Bar**: Floating action buttons for common tasks

### Responsive Design
- **Mobile**: Hamburger menu, stacked layouts, touch-friendly buttons
- **Tablet**: Collapsible sidebar, adaptive grids
- **Desktop**: Full navigation, multi-column layouts

### Accessibility Features
- Screen reader support
- Keyboard navigation
- High contrast mode
- Font size adjustment
- Reduced motion preference

### Performance Optimizations
- Lazy loading for images and data
- Virtual scrolling for long lists
- Cached API responses
- Optimized asset delivery

This comprehensive panel design provides each user role with the tools they need while maintaining a consistent, professional interface across the entire platform.