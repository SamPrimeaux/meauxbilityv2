// MeauxLearn - Professional Course Platform
// Multi-tenant course platform
// Uses Cloudflare D1 and R2 (NO Supabase)

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        if (method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // Route handling
        try {
            // API Routes
            if (path.startsWith('/api/')) {
                return handleAPI(path, request, env, corsHeaders);
            }

            // Page Routes
            if (path === '/' || path === '') {
                return serveHomePage(env, corsHeaders);
            }

            if (path.startsWith('/learn')) {
                return serveLearnPage(path, env, corsHeaders);
            }

            if (path.startsWith('/courses')) {
                return serveCoursePage(path, env, corsHeaders);
            }

            if (path.startsWith('/dashboard')) {
                return serveDashboard(env, corsHeaders);
            }

            // Default: serve home
            return serveHomePage(env, corsHeaders);

        } catch (error) {
            console.error('Error:', error);
            return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
        }
    },
};

// API Handler
async function handleAPI(path, request, env, corsHeaders) {
    const url = new URL(request.url);
    const segments = path.split('/').filter(Boolean);

    // /api/courses
    if (segments[1] === 'courses') {
        if (segments[2] === 'seed' && request.method === 'POST') {
            return seedCourses(env, corsHeaders);
        }
        if (segments[2] && segments[3] === 'lessons') {
            return getCourseLessons(segments[2], env, corsHeaders);
        }
        if (segments[2]) {
            return getCourse(segments[2], env, corsHeaders);
        }
        return listCourses(env, corsHeaders);
    }

    // /api/progress
    if (segments[1] === 'progress') {
        if (request.method === 'POST') {
            return updateProgress(request, env, corsHeaders);
        }
        return getProgress(request, env, corsHeaders);
    }

    // /api/tenant
    if (segments[1] === 'tenant') {
        return getTenant(env, corsHeaders);
    }

    return jsonResponse({ success: false, error: 'Not found' }, 404, corsHeaders);
}

// Database Helpers
async function getTenant(env, corsHeaders) {
    try {
        if (!env.DB) {
            return jsonResponse({ success: false, error: 'Database not available' }, 503, corsHeaders);
        }

        const result = await env.DB.prepare(
            "SELECT * FROM tenants WHERE slug = 'meauxbility' LIMIT 1"
        ).first();

        if (!result) {
            // Create default tenant if doesn't exist
            await env.DB.prepare(
                `INSERT INTO tenants (id, name, slug, domain, created_at) 
                 VALUES ('meauxbility', 'Meauxbility', 'meauxbility', 'meauxbility.org', ?)`
            ).bind(Math.floor(Date.now() / 1000)).run();

            return jsonResponse({
                success: true,
                tenant: {
                    id: 'meauxbility',
                    name: 'Meauxbility',
                    slug: 'meauxbility',
                    domain: 'meauxbility.org'
                }
            }, 200, corsHeaders);
        }

        return jsonResponse({ success: true, tenant: result }, 200, corsHeaders);
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
    }
}

async function listCourses(env, corsHeaders) {
    try {
        if (!env.DB) {
            return jsonResponse({ success: false, error: 'Database not available' }, 503, corsHeaders);
        }

        const result = await env.DB.prepare(
            `SELECT c.*, u.name as instructor_name 
             FROM courses c 
             LEFT JOIN users u ON c.instructor_id = u.id 
             WHERE c.tenant_id = 'meauxbility' AND c.is_published = 1 
             ORDER BY c.sort_order ASC, c.created_at ASC`
        ).all();

        return jsonResponse({ success: true, courses: result.results || [] }, 200, corsHeaders);
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
    }
}

async function getCourse(courseId, env, corsHeaders) {
    try {
        if (!env.DB) {
            return jsonResponse({ success: false, error: 'Database not available' }, 503, corsHeaders);
        }

        const course = await env.DB.prepare(
            `SELECT c.*, u.name as instructor_name 
             FROM courses c 
             LEFT JOIN users u ON c.instructor_id = u.id 
             WHERE c.id = ? AND c.tenant_id = 'meauxbility'`
        ).bind(courseId).first();

        if (!course) {
            return jsonResponse({ success: false, error: 'Course not found' }, 404, corsHeaders);
        }

        const lessons = await env.DB.prepare(
            `SELECT * FROM lessons 
             WHERE course_id = ? 
             ORDER BY sort_order ASC`
        ).bind(courseId).all();

        return jsonResponse({
            success: true,
            course: course,
            lessons: lessons.results || []
        }, 200, corsHeaders);
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
    }
}

async function getCourseLessons(courseId, env, corsHeaders) {
    try {
        if (!env.DB) {
            return jsonResponse({ success: false, error: 'Database not available' }, 503, corsHeaders);
        }

        const result = await env.DB.prepare(
            `SELECT * FROM lessons 
             WHERE course_id = ? 
             ORDER BY sort_order ASC`
        ).bind(courseId).all();

        return jsonResponse({ success: true, lessons: result.results || [] }, 200, corsHeaders);
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
    }
}

async function seedCourses(env, corsHeaders) {
    try {
        if (!env.DB) {
            return jsonResponse({ success: false, error: 'Database not available' }, 503, corsHeaders);
        }

        // Check if schema exists, if not create it
        await initDatabase(env);

        return jsonResponse({
            success: true,
            message: 'Courses seeded successfully. Run the seed SQL file to populate data.'
        }, 200, corsHeaders);
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
    }
}

async function initDatabase(env) {
    // This would run the schema SQL
    // For now, just ensure tables exist
    try {
        await env.DB.prepare(
            `CREATE TABLE IF NOT EXISTS tenants (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                domain TEXT,
                created_at INTEGER DEFAULT (unixepoch())
            )`
        ).run();
    } catch (e) {
        // Table might already exist
    }
}

async function updateProgress(request, env, corsHeaders) {
    try {
        if (!env.DB) {
            return jsonResponse({ success: false, error: 'Database not available' }, 503, corsHeaders);
        }

        const body = await request.json();
        const { user_id, course_id, lesson_id, completed, progress_percent } = body;

        await env.DB.prepare(
            `INSERT INTO user_progress (id, user_id, course_id, lesson_id, completed, progress_percent, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
             completed = excluded.completed,
             progress_percent = excluded.progress_percent,
             updated_at = excluded.updated_at`
        ).bind(
            `${user_id}-${course_id}-${lesson_id || 'course'}`,
            user_id,
            course_id,
            lesson_id || null,
            completed ? 1 : 0,
            progress_percent || 0,
            Math.floor(Date.now() / 1000)
        ).run();

        return jsonResponse({ success: true }, 200, corsHeaders);
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
    }
}

async function getProgress(request, env, corsHeaders) {
    try {
        if (!env.DB) {
            return jsonResponse({ success: false, error: 'Database not available' }, 503, corsHeaders);
        }

        const url = new URL(request.url);
        const userId = url.searchParams.get('user_id') || 'default-user';
        const courseId = url.searchParams.get('course_id');

        let query = `SELECT * FROM user_progress WHERE user_id = ?`;
        let params = [userId];

        if (courseId) {
            query += ` AND course_id = ?`;
            params.push(courseId);
        }

        const result = await env.DB.prepare(query).bind(...params).all();

        return jsonResponse({ success: true, progress: result.results || [] }, 200, corsHeaders);
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
    }
}

// Page Handlers
async function serveHomePage(env, corsHeaders) {
    const html = await getHTMLTemplate('home');
    return new Response(html, {
        headers: {
            ...corsHeaders,
            "Content-Type": "text/html;charset=UTF-8",
        },
    });
}

async function serveLearnPage(path, env, corsHeaders) {
    const html = await getHTMLTemplate('learn');
    return new Response(html, {
        headers: {
            ...corsHeaders,
            "Content-Type": "text/html;charset=UTF-8",
        },
    });
}

async function serveCoursePage(path, env, corsHeaders) {
    const html = await getHTMLTemplate('course');
    return new Response(html, {
        headers: {
            ...corsHeaders,
            "Content-Type": "text/html;charset=UTF-8",
        },
    });
}

async function serveDashboard(env, corsHeaders) {
    const html = await getHTMLTemplate('dashboard');
    return new Response(html, {
        headers: {
            ...corsHeaders,
            "Content-Type": "text/html;charset=UTF-8",
        },
    });
}

// HTML Templates
async function getHTMLTemplate(page) {
    if (page === 'home') {
        return getHomePageHTML();
    }
    if (page === 'learn') {
        return getLearnPageHTML();
    }
    if (page === 'course') {
        return getCoursePageHTML();
    }
    if (page === 'dashboard') {
        return getDashboardHTML();
    }
    return getHomePageHTML();
}

function getHomePageHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeauxLearn - Professional Course Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: #E5E7EB;
            min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .hero {
            text-align: center;
            padding: 4rem 0;
        }
        .hero h1 {
            font-size: 4rem;
            font-weight: 900;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        .hero p {
            font-size: 1.5rem;
            color: #8E8E93;
            margin-bottom: 2rem;
        }
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            padding: 16px 32px;
            background: linear-gradient(135deg, #007AFF, #8B5CF6);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            transition: all 0.3s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(0, 122, 255, 0.4);
        }
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>MeauxLearn</h1>
            <p>Professional Course Platform for Team Onboarding & Training</p>
            <div class="cta-buttons">
                <a href="/learn" class="btn">Browse Courses</a>
                <a href="/dashboard" class="btn btn-secondary">My Dashboard</a>
            </div>
        </div>
    </div>
    <script>
        // Fetch and display courses
        fetch('/api/courses')
            .then(r => r.json())
            .then(data => {
                if (data.success && data.courses.length > 0) {
                    console.log('Courses loaded:', data.courses.length);
                }
            });
    </script>
</body>
</html>`;
}

function getLearnPageHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Courses - MeauxLearn</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: #E5E7EB;
            min-height: 100vh;
            padding: 2rem;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .header {
            margin-bottom: 3rem;
            text-align: center;
        }
        .header h1 {
            font-size: 3rem;
            font-weight: 900;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 2rem;
        }
        .course-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 1.5rem;
            transition: all 0.3s;
            cursor: pointer;
        }
        .course-card:hover {
            transform: translateY(-4px);
            border-color: rgba(0, 212, 255, 0.5);
            box-shadow: 0 12px 32px rgba(0, 212, 255, 0.2);
        }
        .course-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .course-description {
            color: #8E8E93;
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        .course-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.875rem;
            color: #8E8E93;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        .badge-beginner { background: rgba(52, 199, 89, 0.2); color: #34C759; }
        .badge-intermediate { background: rgba(255, 149, 0, 0.2); color: #FF9500; }
        .badge-advanced { background: rgba(255, 59, 48, 0.2); color: #FF3B30; }
        .loading {
            text-align: center;
            padding: 4rem;
            color: #8E8E93;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>All Courses</h1>
            <p style="color: #8E8E93;">Professional training for your team</p>
        </div>
        <div id="courses-container" class="loading">Loading courses...</div>
    </div>
    <script>
        async function loadCourses() {
            try {
                const res = await fetch('/api/courses');
                const data = await res.json();
                
                if (data.success && data.courses.length > 0) {
                    const container = document.getElementById('courses-container');
                    container.className = 'courses-grid';
                    container.innerHTML = data.courses.map(course => \`
                        <div class="course-card" onclick="window.location.href='/courses/\${course.slug}'">
                            <div class="course-title">\${course.title}</div>
                            <div class="course-description">\${course.description || 'No description'}</div>
                            <div class="course-meta">
                                <span class="badge badge-\${course.difficulty}">\${course.difficulty}</span>
                                <span>\${course.duration_minutes || 0} min</span>
                            </div>
                        </div>
                    \`).join('');
                } else {
                    document.getElementById('courses-container').innerHTML = 
                        '<div class="loading">No courses available. Run the seed script to populate courses.</div>';
                }
            } catch (error) {
                document.getElementById('courses-container').innerHTML = 
                    '<div class="loading">Error loading courses. Make sure the database is initialized.</div>';
            }
        }
        loadCourses();
    </script>
</body>
</html>`;
}

function getCoursePageHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course - MeauxLearn</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: #E5E7EB;
            min-height: 100vh;
            padding: 2rem;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .back-link {
            color: #8E8E93;
            text-decoration: none;
            margin-bottom: 2rem;
            display: inline-block;
        }
        .course-header {
            margin-bottom: 3rem;
        }
        .course-title {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 1rem;
        }
        .lessons-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .lesson-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s;
        }
        .lesson-item:hover {
            border-color: rgba(0, 212, 255, 0.5);
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/learn" class="back-link">← Back to Courses</a>
        <div id="course-content">
            <div class="loading">Loading course...</div>
        </div>
    </div>
    <script>
        const path = window.location.pathname;
        const courseSlug = path.split('/courses/')[1];
        
        async function loadCourse() {
            try {
                const res = await fetch(\`/api/courses/\${courseSlug}\`);
                const data = await res.json();
                
                if (data.success && data.course) {
                    document.getElementById('course-content').innerHTML = \`
                        <div class="course-header">
                            <h1 class="course-title">\${data.course.title}</h1>
                            <p style="color: #8E8E93;">\${data.course.description}</p>
                        </div>
                        <div class="lessons-list">
                            \${data.lessons.map((lesson, i) => \`
                                <div class="lesson-item">
                                    <h3>\${i + 1}. \${lesson.title}</h3>
                                    <p style="color: #8E8E93; margin-top: 0.5rem;">\${lesson.duration_minutes || 0} min</p>
                                </div>
                            \`).join('')}
                        </div>
                    \`;
                }
            } catch (error) {
                document.getElementById('course-content').innerHTML = 
                    '<div class="loading">Error loading course.</div>';
            }
        }
        loadCourse();
    </script>
</body>
</html>`;
}

function getDashboardHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - MeauxLearn</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: #E5E7EB;
            min-height: 100vh;
            padding: 2rem;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header h1 {
            font-size: 3rem;
            font-weight: 900;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>My Dashboard</h1>
            <p style="color: #8E8E93;">Track your learning progress</p>
        </div>
        <p style="color: #8E8E93;">Dashboard coming soon...</p>
    </div>
</body>
</html>`;
}

// Helper Functions
function jsonResponse(data, status = 200, corsHeaders = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
        },
    });
}
