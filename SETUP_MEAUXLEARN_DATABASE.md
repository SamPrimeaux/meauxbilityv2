# MeauxLearn Database Setup Guide

Since Wrangler CLI has authentication issues, use the Cloudflare Dashboard to set up the database.

## 🚀 Quick Setup via Cloudflare Dashboard

### Step 1: Access D1 Database Console

1. Go to: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **D1**
3. Find and click on **meaux-work-db** (ID: `2a3a763a-92f1-4633-849e-268ddb31998f`)
4. Click on the **Console** tab

### Step 2: Run Schema SQL

1. Open `database/meauxlearn-schema.sql` in your editor
2. Copy the **entire contents** of the file
3. Paste into the D1 Console SQL editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Wait for confirmation that tables were created

**Expected Output:**
- ✅ `tenants` table created
- ✅ `users` table created
- ✅ `courses` table created
- ✅ `lessons` table created
- ✅ `user_progress` table created
- ✅ `enrollments` table created
- ✅ Indexes created

### Step 3: Seed Initial Data

1. Open `database/meauxlearn-seed.sql` in your editor
2. Copy the **entire contents** of the file
3. Paste into the D1 Console SQL editor
4. Click **Run**
5. Wait for confirmation

**Expected Output:**
- ✅ 1 tenant created (Meauxbility)
- ✅ 1 admin user created
- ✅ 14 courses created
- ✅ 2 sample lessons created

### Step 4: Verify Setup

Run these queries in the D1 Console to verify:

**Check tenants:**
```sql
SELECT * FROM tenants;
```
Should show: `meauxbility` tenant

**Check courses:**
```sql
SELECT id, title, slug, difficulty FROM courses ORDER BY sort_order;
```
Should show: 14 courses

**Check lessons:**
```sql
SELECT id, course_id, title FROM lessons;
```
Should show: 2 sample lessons

## 📋 Alternative: Run SQL in Parts

If the full files are too large, run them in sections:

### Schema (Part 1 - Tables)
```sql
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    logo_url TEXT,
    theme JSON,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'student',
    github_id TEXT,
    github_username TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(tenant_id, email)
);

CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    instructor_id TEXT,
    difficulty TEXT DEFAULT 'beginner',
    duration_minutes INTEGER,
    is_published INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id),
    UNIQUE(tenant_id, slug)
);

CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_preview INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(course_id, slug)
);

CREATE TABLE IF NOT EXISTS user_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    lesson_id TEXT,
    completed INTEGER DEFAULT 0,
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
```

### Schema (Part 2 - Indexes)
```sql
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_courses_tenant ON courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
```

### Seed Data (Tenant & User)
```sql
INSERT OR IGNORE INTO tenants (id, name, slug, domain, created_at) VALUES
('meauxbility', 'Meauxbility', 'meauxbility', 'meauxbility.org', unixepoch());

INSERT OR IGNORE INTO users (id, tenant_id, email, name, role, created_at) VALUES
('admin-meauxbility', 'meauxbility', 'admin@meauxbility.org', 'Meauxbility Admin', 'admin', unixepoch());
```

### Seed Data (Courses - Run in batches if needed)
Copy courses from `database/meauxlearn-seed.sql` in smaller batches.

## ✅ Verification Checklist

After setup, verify:

- [ ] `tenants` table exists and has 1 row
- [ ] `users` table exists and has 1 row
- [ ] `courses` table exists and has 14 rows
- [ ] `lessons` table exists and has at least 2 rows
- [ ] All indexes created successfully
- [ ] Can query courses: `SELECT * FROM courses LIMIT 5`

## 🐛 Troubleshooting

### "Table already exists" errors
- This is OK! The `IF NOT EXISTS` clause prevents errors
- Just continue with the next SQL statement

### Foreign key constraint errors
- Make sure you run tables in order: tenants → users → courses → lessons
- Check that tenant_id values match

### "No such table" errors
- Run the schema SQL first
- Make sure all CREATE TABLE statements succeeded

## 🎯 Next Steps

Once database is set up:

1. **Deploy worker** (already done via GitHub Actions)
2. **Test the API:**
   ```bash
   curl https://fuelnfreetime.meauxbility.workers.dev/api/courses
   ```
3. **Visit the platform:**
   - https://fuelnfreetime.meauxbility.workers.dev/learn

## 📝 Notes

- Database ID: `2a3a763a-92f1-4633-849e-268ddb31998f`
- Database Name: `meaux-work-db`
- All SQL files are in `database/` folder
- Use Cloudflare Dashboard Console for best results
