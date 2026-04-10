# Supabase Integration Plan

## Overview
This document outlines the plan for integrating Supabase (PostgreSQL database with real-time capabilities) with the NotesByRaheem.xyz website. The current implementation uses localStorage/sessionStorage for simulation, which will be replaced with Supabase for production deployment.

## Current Architecture
- Frontend: HTML, CSS, JavaScript (static files)
- Authentication: Simulated with localStorage/sessionStorage
- Data Storage: localStorage for users, notes, and other data
- User Roles: Owner, Admin, Student

## Supabase Setup

### 1. Create Supabase Project
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project named "notesbyraheem"
3. Note the project URL and anon/public key
4. Set up database schema based on the existing data model

### 2. Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'student')),
  roll_number TEXT,  -- For students only
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
```

#### Notes Table
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  course TEXT NOT NULL CHECK (course IN ('mvc', 'se', 'cn', 'cce', 'vp', 'coal')),
  file_url TEXT,  -- Supabase Storage URL
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}'
);

-- Create indexes
CREATE INDEX idx_notes_course ON notes(course);
CREATE INDEX idx_notes_status ON notes(status);
CREATE INDEX idx_notes_author ON notes(author_id);
```

#### Downloads/Views Tracking
```sql
CREATE TABLE note_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('view', 'download', 'rate')),
  rating_value DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Row Level Security (RLS)
Enable RLS on all tables and create policies:

```sql
-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Only owners and admins can view all users
CREATE POLICY "Owners and admins can view all users" ON users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('owner', 'admin'))
  );

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Only owners can insert/update users
CREATE POLICY "Only owners can manage users" ON users
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'owner')
  );

-- Notes table policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Everyone can view approved notes
CREATE POLICY "Everyone can view approved notes" ON notes
  FOR SELECT USING (status = 'approved');

-- Students can view their own notes (pending or approved)
CREATE POLICY "Students can view their own notes" ON notes
  FOR SELECT USING (
    author_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'owner'))
  );

-- Students can insert notes
CREATE POLICY "Students can insert notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Admins and owners can update note status
CREATE POLICY "Admins and owners can update notes" ON notes
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'owner'))
  );
```

## Frontend Integration

### 1. Supabase Client Setup
Create `js/supabase/client.js`:

```javascript
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 2. Authentication Migration
Replace localStorage authentication with Supabase Auth:

```javascript
// New login function
async function loginWithSupabase(username, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username + '@notesbyraheem.xyz', // or use username field
    password: password
  })
  
  if (error) throw error
  return data
}

// Session management
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    // Store user info in localStorage for quick access
    localStorage.setItem('currentUser', JSON.stringify({
      id: session.user.id,
      email: session.user.email,
      // Additional user data from users table
    }))
  } else {
    localStorage.removeItem('currentUser')
  }
})
```

### 3. Data Fetching Examples

#### Fetch Approved Notes
```javascript
async function fetchApprovedNotes(course = null) {
  let query = supabase
    .from('notes')
    .select(`
      *,
      users:author_id(full_name, username)
    `)
    .eq('status', 'approved')
    .order('uploaded_at', { ascending: false })
  
  if (course) {
    query = query.eq('course', course)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}
```

#### Upload Note
```javascript
async function uploadNote(noteData, file) {
  // 1. Upload file to Supabase Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `notes/${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('notes-bucket')
    .upload(filePath, file)
  
  if (uploadError) throw uploadError
  
  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('notes-bucket')
    .getPublicUrl(filePath)
  
  // 3. Insert note record
  const { data, error } = await supabase
    .from('notes')
    .insert({
      title: noteData.title,
      description: noteData.description,
      course: noteData.course,
      file_url: publicUrl,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      author_id: noteData.authorId,
      status: 'pending'
    })
    .select()
  
  if (error) throw error
  return data
}
```

## Migration Steps

### Phase 1: Setup and Testing
1. Create Supabase project and database schema
2. Set up authentication with email/password
3. Create test users (owner, admin, student)
4. Test basic CRUD operations

### Phase 2: Authentication Migration
1. Update login.html to use Supabase Auth
2. Update all dashboard authentication checks
3. Implement session persistence
4. Test login/logout flows

### Phase 3: Data Migration
1. Create migration script to move localStorage data to Supabase
2. Update all data fetching functions (notes, users, stats)
3. Implement real-time subscriptions for admin dashboard
4. Test all user flows

### Phase 4: File Upload Integration
1. Set up Supabase Storage bucket for notes
2. Update upload.html to use Supabase Storage
3. Implement file validation and virus scanning
4. Test upload/download functionality

## Environment Configuration

Create `.env` file for local development:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Update `js/config.js`:
```javascript
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  }
}
```

## Security Considerations

1. **Never expose service_role key in frontend**
2. **Use RLS for all database operations**
3. **Validate file types and sizes on upload**
4. **Implement rate limiting for API calls**
5. **Use HTTPS for all connections**
6. **Regularly audit database permissions**

## Performance Optimization

1. **Use Supabase CDN for file downloads**
2. **Implement pagination for note listings**
3. **Cache frequently accessed data**
4. **Use database indexes appropriately**
5. **Monitor query performance with Supabase Dashboard**

## Monitoring and Maintenance

1. **Set up Supabase Dashboard alerts**
2. **Monitor storage usage**
3. **Regularly backup database**
4. **Update Supabase client library**
5. **Review and update security policies**

## Deployment Checklist

- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] RLS policies configured
- [ ] Storage bucket created
- [ ] Authentication configured
- [ ] Frontend Supabase client integrated
- [ ] All user flows tested
- [ ] Environment variables set in Netlify
- [ ] Backup strategy implemented

## Next Steps

1. Create migration scripts for existing localStorage data
2. Implement progressive enhancement (fallback to localStorage if Supabase unavailable)
3. Add error handling and user feedback
4. Create admin interface for user management
5. Implement analytics and reporting