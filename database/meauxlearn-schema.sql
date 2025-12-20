-- MeauxLearn Course Platform Schema
-- Multi-tenant course platform for team onboarding and training
-- Uses Cloudflare D1 Database

-- Tenants table (multi-tenant support)
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    logo_url TEXT,
    theme JSON, -- Custom theme settings
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Users table (tenant-aware)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'student', -- student, instructor, admin
    github_id TEXT,
    github_username TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(tenant_id, email)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    instructor_id TEXT,
    difficulty TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
    duration_minutes INTEGER,
    is_published INTEGER DEFAULT 0, -- 0 = draft, 1 = published
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id),
    UNIQUE(tenant_id, slug)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT, -- Markdown content
    video_url TEXT,
    duration_minutes INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_preview INTEGER DEFAULT 0, -- 0 = locked, 1 = preview
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(course_id, slug)
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    lesson_id TEXT,
    completed INTEGER DEFAULT 0, -- 0 = in progress, 1 = completed
    progress_percent INTEGER DEFAULT 0,
    last_accessed_at INTEGER DEFAULT (unixepoch()),
    completed_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    UNIQUE(user_id, course_id, lesson_id)
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    enrolled_at INTEGER DEFAULT (unixepoch()),
    completed_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(user_id, course_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_courses_tenant ON courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
