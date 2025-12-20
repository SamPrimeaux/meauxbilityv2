# MeauxLearn - Deployment Guide

**Professional Course Platform** - Multi-tenant course platform for team onboarding and training.

## 🚀 Quick Start

### Prerequisites
- Cloudflare account with Workers, D1, and R2 enabled
- GitHub account for CI/CD
- Node.js 18+ (for local development)

### Tech Stack
- **Cloudflare Workers** - Serverless runtime
- **Cloudflare D1** - SQLite database
- **Cloudflare R2** - Object storage
- **NO Supabase** - Pure Cloudflare stack

## 📋 Setup Steps

### 1. Initialize Database Schema

The database schema is in `database/meauxlearn-schema.sql`. You need to run this in your D1 database.

**Option A: Via Wrangler CLI**
```bash
cd /Users/samprimeaux/Downloads/hybridprosaas-dashboard

# Run schema
wrangler d1 execute meaux-work-db --file=database/meauxlearn-schema.sql

# Seed initial data
wrangler d1 execute meaux-work-db --file=database/meauxlearn-seed.sql
```

**Option B: Via Cloudflare Dashboard**
1. Go to: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **D1**
3. Select **meaux-work-db**
4. Go to **Console** tab
5. Copy and paste the contents of `database/meauxlearn-schema.sql`
6. Click **Run**
7. Repeat for `database/meauxlearn-seed.sql`

### 2. Verify Worker Bindings

The `wrangler.fuelnfreetime.jsonc` should have:
```jsonc
{
  "r2_buckets": [
    {
      "binding": "R2_STORAGE",
      "bucket_name": "inneranimalmedia"
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "meaux-work-db",
      "database_id": "2a3a763a-92f1-4633-849e-268ddb31998f"
    }
  ]
}
```

### 3. Deploy Worker

**Via GitHub Actions (Recommended)**
```bash
git add .
git commit -m "feat: Add MeauxLearn course platform"
git push origin main
```

The workflow `.github/workflows/deploy-fuelnfreetime.yml` will automatically deploy.

**Via Wrangler CLI**
```bash
wrangler deploy --config wrangler.fuelnfreetime.jsonc
```

### 4. Seed Courses (Optional)

After deployment, you can seed courses via API:
```bash
curl -X POST https://fuelnfreetime.meauxbility.workers.dev/api/courses/seed
```

Or run the seed SQL file directly in D1.

## 🌐 URLs

Once deployed:
- **Home**: https://fuelnfreetime.meauxbility.workers.dev/
- **Courses**: https://fuelnfreetime.meauxbility.workers.dev/learn
- **Dashboard**: https://fuelnfreetime.meauxbility.workers.dev/dashboard
- **API**: https://fuelnfreetime.meauxbility.workers.dev/api/courses

## 📚 API Endpoints

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details with lessons
- `GET /api/courses/:id/lessons` - Get course lessons

### Progress
- `GET /api/progress?user_id=xxx&course_id=xxx` - Get user progress
- `POST /api/progress` - Update progress
  ```json
  {
    "user_id": "user-123",
    "course_id": "course-platform-onboarding",
    "lesson_id": "lesson-1",
    "completed": true,
    "progress_percent": 100
  }
  ```

### Tenant
- `GET /api/tenant` - Get tenant information

## 🎯 Features

✅ Multi-tenant support
✅ Course management
✅ Lesson tracking
✅ User progress tracking
✅ Beautiful iOS-level UI
✅ Mobile responsive
✅ Cloudflare D1 + R2 (NO Supabase)
✅ GitHub Actions CI/CD

## 📁 Project Structure

```
fuelnfreetime/
├── src/
│   └── fuelnfreetime.js      # Main worker code
├── database/
│   ├── meauxlearn-schema.sql # Database schema
│   └── meauxlearn-seed.sql   # Seed data
├── wrangler.fuelnfreetime.jsonc  # Worker config
└── .github/workflows/
    └── deploy-fuelnfreetime.yml   # CI/CD workflow
```

## 🔧 Development

### Local Development
```bash
# Install Wrangler
npm install -g wrangler

# Run locally
wrangler dev --config wrangler.fuelnfreetime.jsonc

# Test database
wrangler d1 execute meaux-work-db --command "SELECT * FROM courses LIMIT 5"
```

### Database Queries
```bash
# List all courses
wrangler d1 execute meaux-work-db --command "SELECT * FROM courses"

# Check tenant
wrangler d1 execute meaux-work-db --command "SELECT * FROM tenants"

# View user progress
wrangler d1 execute meaux-work-db --command "SELECT * FROM user_progress"
```

## 🎨 Customization

### Add New Course
1. Insert into `courses` table:
```sql
INSERT INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order)
VALUES ('course-new', 'meauxbility', 'New Course', 'new-course', 'Description', 'admin-meauxbility', 'beginner', 60, 1, 15);
```

2. Add lessons:
```sql
INSERT INTO lessons (id, course_id, title, slug, content, sort_order)
VALUES ('lesson-new-1', 'course-new', 'Lesson 1', 'lesson-1', '# Content', 1);
```

### Multi-Tenant Setup
1. Create new tenant:
```sql
INSERT INTO tenants (id, name, slug, domain)
VALUES ('new-tenant', 'New Company', 'new-company', 'newcompany.com');
```

2. Update course queries to filter by `tenant_id`

## ✅ Verification Checklist

- [ ] Database schema created
- [ ] Seed data loaded
- [ ] Worker deployed
- [ ] Bindings configured (R2 + D1)
- [ ] Home page loads
- [ ] Courses page shows courses
- [ ] API endpoints working
- [ ] GitHub Actions workflow running

## 🐛 Troubleshooting

### Database not available
- Check D1 binding in `wrangler.fuelnfreetime.jsonc`
- Verify database ID is correct
- Ensure database exists in Cloudflare Dashboard

### No courses showing
- Run seed SQL file
- Check `is_published = 1` in courses table
- Verify tenant_id matches

### API errors
- Check worker logs in Cloudflare Dashboard
- Verify CORS headers
- Ensure database queries are correct

## 📝 Notes

- **NO Supabase** - This is a pure Cloudflare stack
- Uses D1 for database (SQLite)
- Uses R2 for file storage
- Multi-tenant ready
- GitHub Actions for CI/CD

Built for Meauxbility teams 🚀
