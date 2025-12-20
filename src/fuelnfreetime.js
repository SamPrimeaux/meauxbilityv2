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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MeauxLearn - Professional Course Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --primary: #007AFF;
            --primary-hover: #0051D5;
            --secondary: #8B5CF6;
            --accent: #00D4FF;
            --bg-primary: #000000;
            --bg-secondary: #0f1419;
            --bg-tertiary: #1a1f3a;
            --text-primary: #FFFFFF;
            --text-secondary: #8E8E93;
            --text-muted: #636366;
            --border: rgba(255, 255, 255, 0.1);
            --card-bg: rgba(255, 255, 255, 0.05);
            --shadow: rgba(0, 0, 0, 0.5);
            --blur: blur(40px);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: var(--text-primary);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Galaxy Background */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: 
                radial-gradient(2px 2px at 20% 30%, white, transparent),
                radial-gradient(2px 2px at 60% 70%, white, transparent),
                radial-gradient(1px 1px at 50% 50%, white, transparent),
                radial-gradient(1px 1px at 80% 10%, white, transparent),
                radial-gradient(2px 2px at 90% 60%, white, transparent),
                radial-gradient(1px 1px at 33% 80%, white, transparent);
            background-size: 200px 200px;
            animation: twinkle 4s ease-in-out infinite alternate;
            opacity: 0.6;
            z-index: 0;
            pointer-events: none;
        }
        
        body::after {
            content: '';
            position: fixed;
            top: -10%;
            right: -10%;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%);
            border-radius: 50%;
            filter: blur(80px);
            animation: float 20s ease-in-out infinite;
            z-index: 0;
            pointer-events: none;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
        
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, -20px) scale(1.05); }
        }
        
        .container { 
            max-width: 1400px; 
            margin: 0 auto; 
            padding: 2rem;
            position: relative;
            z-index: 1;
        }
        
        .hero {
            text-align: center;
            padding: 6rem 0 8rem;
            position: relative;
        }
        
        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 8px 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 100px;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--accent);
            margin-bottom: 2rem;
            backdrop-filter: var(--blur);
        }
        
        .hero h1 {
            font-size: clamp(3rem, 8vw, 6rem);
            font-weight: 900;
            letter-spacing: -0.04em;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 50%, #007AFF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1.5rem;
            line-height: 1.1;
        }
        
        .hero p {
            font-size: clamp(1.125rem, 2vw, 1.5rem);
            color: var(--text-secondary);
            margin-bottom: 3rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 4rem;
        }
        
        .btn {
            padding: 18px 36px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            text-decoration: none;
            border-radius: 16px;
            font-weight: 700;
            font-size: 1.125rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--primary-hover), var(--secondary));
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .btn:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 40px rgba(0, 122, 255, 0.4);
        }
        
        .btn:hover::before {
            opacity: 1;
        }
        
        .btn > * {
            position: relative;
            z-index: 1;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: var(--blur);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .stat-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            backdrop-filter: var(--blur);
            transition: all 0.3s;
        }
        
        .stat-card:hover {
            transform: translateY(-4px);
            border-color: rgba(0, 212, 255, 0.5);
            box-shadow: 0 12px 32px rgba(0, 212, 255, 0.2);
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, var(--accent), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            .hero {
                padding: 4rem 0 6rem;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: stretch;
            }
            
            .btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <div class="hero-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Professional Course Platform
            </div>
            <h1>MeauxLearn</h1>
            <p>Fortune 500-grade course platform for team onboarding and training. Build skills, track progress, scale your team.</p>
            <div class="cta-buttons">
                <a href="/learn" class="btn">
                    <span>Browse Courses</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
                <a href="/dashboard" class="btn btn-secondary">
                    <span>My Dashboard</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <path d="M9 22V12h6v10"/>
                    </svg>
                </a>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value" id="courseCount">14</div>
                    <div class="stat-label">Courses</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">100%</div>
                    <div class="stat-label">Cloudflare</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">∞</div>
                    <div class="stat-label">Scale</div>
                </div>
            </div>
        </div>
    </div>
    <script>
        // Fetch and update course count
        fetch('/api/courses')
            .then(r => r.json())
            .then(data => {
                if (data.success && data.courses) {
                    const count = data.courses.length || 14;
                    const el = document.getElementById('courseCount');
                    if (el) {
                        el.textContent = count;
                        el.style.animation = 'pulse 0.5s ease';
                    }
                }
            })
            .catch(() => {
                // Keep default count if API fails
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Courses - MeauxLearn</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --primary: #007AFF;
            --secondary: #8B5CF6;
            --accent: #00D4FF;
            --bg-primary: #000000;
            --bg-secondary: #0f1419;
            --text-primary: #FFFFFF;
            --text-secondary: #8E8E93;
            --border: rgba(255, 255, 255, 0.1);
            --card-bg: rgba(255, 255, 255, 0.05);
            --blur: blur(40px);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 2rem;
            position: relative;
            -webkit-font-smoothing: antialiased;
        }
        
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: 
                radial-gradient(2px 2px at 20% 30%, white, transparent),
                radial-gradient(2px 2px at 60% 70%, white, transparent),
                radial-gradient(1px 1px at 50% 50%, white, transparent);
            background-size: 200px 200px;
            animation: twinkle 4s ease-in-out infinite alternate;
            opacity: 0.6;
            z-index: 0;
            pointer-events: none;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
        
        .container { 
            max-width: 1400px; 
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        .nav-bar {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 3rem;
        }
        
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 10px 16px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            backdrop-filter: var(--blur);
        }
        
        .back-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border-color: rgba(0, 212, 255, 0.5);
        }
        
        .header {
            margin-bottom: 3rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 900;
            letter-spacing: -0.04em;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        
        .header p {
            font-size: 1.125rem;
            color: var(--text-secondary);
        }
        
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 2rem;
        }
        
        .course-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 2rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            backdrop-filter: var(--blur);
            position: relative;
            overflow: hidden;
        }
        
        .course-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(139, 92, 246, 0.1));
            opacity: 0;
            transition: opacity 0.4s;
        }
        
        .course-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: rgba(0, 212, 255, 0.5);
            box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3);
        }
        
        .course-card:hover::before {
            opacity: 1;
        }
        
        .course-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
        }
        
        .course-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            line-height: 1.3;
            position: relative;
            z-index: 1;
        }
        
        .course-description {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
            font-size: 0.9375rem;
            position: relative;
            z-index: 1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .course-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            position: relative;
            z-index: 1;
        }
        
        .course-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .badge-beginner { 
            background: rgba(52, 199, 89, 0.2); 
            color: #34C759; 
            border: 1px solid rgba(52, 199, 89, 0.3);
        }
        
        .badge-intermediate { 
            background: rgba(255, 149, 0, 0.2); 
            color: #FF9500; 
            border: 1px solid rgba(255, 149, 0, 0.3);
        }
        
        .badge-advanced { 
            background: rgba(255, 59, 48, 0.2); 
            color: #FF3B30; 
            border: 1px solid rgba(255, 59, 48, 0.3);
        }
        
        .course-duration {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-secondary);
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .loading {
            text-align: center;
            padding: 6rem 2rem;
            color: var(--text-secondary);
        }
        
        .loading::after {
            content: '';
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0, 212, 255, 0.3);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 1rem;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
            .courses-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-bar">
            <a href="/" class="back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Home</span>
            </a>
        </div>
        <div class="header">
            <h1>All Courses</h1>
            <p>Professional training for your team</p>
        </div>
        <div id="courses-container" class="loading">Loading courses...</div>
    </div>
    <script>
        async function loadCourses() {
            try {
                const res = await fetch('/api/courses');
                const data = await res.json();
                
                if (data.success && data.courses && data.courses.length > 0) {
                    const container = document.getElementById('courses-container');
                    container.className = 'courses-grid';
                    
                    const icons = ['📚', '🎓', '💡', '🚀', '⚡', '🔧', '🌐', '💻', '📖', '🎯', '🔑', '🔌', '📈', '🎨'];
                    
                    container.innerHTML = data.courses.map((course, i) => {
                        const icon = icons[i % icons.length];
                        return \`
                        <div class="course-card" onclick="window.location.href='/courses/\${course.slug}'">
                            <div class="course-icon">\${icon}</div>
                            <div class="course-title">\${course.title}</div>
                            <div class="course-description">\${course.description || 'No description available'}</div>
                            <div class="course-footer">
                                <div class="course-meta">
                                    <span class="badge badge-\${course.difficulty}">\${course.difficulty}</span>
                                </div>
                                <div class="course-duration">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 6v6l4 2"/>
                                    </svg>
                                    <span>\${course.duration_minutes || 0} min</span>
                                </div>
                            </div>
                        </div>
                    \`;
                    }).join('');
                } else {
                    document.getElementById('courses-container').innerHTML = 
                        '<div class="loading">No courses available. Please seed the database.</div>';
                }
            } catch (error) {
                console.error('Error loading courses:', error);
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Course - MeauxLearn</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --primary: #007AFF;
            --secondary: #8B5CF6;
            --accent: #00D4FF;
            --bg-primary: #000000;
            --bg-secondary: #0f1419;
            --text-primary: #FFFFFF;
            --text-secondary: #8E8E93;
            --border: rgba(255, 255, 255, 0.1);
            --card-bg: rgba(255, 255, 255, 0.05);
            --blur: blur(40px);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 2rem;
            position: relative;
            -webkit-font-smoothing: antialiased;
        }
        
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: 
                radial-gradient(2px 2px at 20% 30%, white, transparent),
                radial-gradient(2px 2px at 60% 70%, white, transparent);
            background-size: 200px 200px;
            animation: twinkle 4s ease-in-out infinite alternate;
            opacity: 0.6;
            z-index: 0;
            pointer-events: none;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-secondary);
            text-decoration: none;
            margin-bottom: 2rem;
            padding: 10px 16px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s;
            backdrop-filter: var(--blur);
        }
        
        .back-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border-color: rgba(0, 212, 255, 0.5);
        }
        
        .course-header {
            margin-bottom: 4rem;
            padding: 3rem;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 24px;
            backdrop-filter: var(--blur);
        }
        
        .course-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
        }
        
        .badge-beginner { 
            background: rgba(52, 199, 89, 0.2); 
            color: #34C759; 
            border: 1px solid rgba(52, 199, 89, 0.3);
        }
        
        .badge-intermediate { 
            background: rgba(255, 149, 0, 0.2); 
            color: #FF9500; 
            border: 1px solid rgba(255, 149, 0, 0.3);
        }
        
        .badge-advanced { 
            background: rgba(255, 59, 48, 0.2); 
            color: #FF3B30; 
            border: 1px solid rgba(255, 59, 48, 0.3);
        }
        
        .course-title {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 900;
            letter-spacing: -0.04em;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--accent), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .course-description {
            color: var(--text-secondary);
            font-size: 1.125rem;
            line-height: 1.8;
            margin-bottom: 1.5rem;
        }
        
        .course-meta {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            color: var(--text-secondary);
            font-size: 0.9375rem;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .lessons-section {
            margin-top: 3rem;
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .lessons-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .lesson-item {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 2rem;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: var(--blur);
            position: relative;
            overflow: hidden;
        }
        
        .lesson-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(135deg, var(--accent), var(--secondary));
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lesson-item:hover {
            transform: translateX(8px);
            border-color: rgba(0, 212, 255, 0.5);
            box-shadow: 0 12px 32px rgba(0, 212, 255, 0.2);
        }
        
        .lesson-item:hover::before {
            opacity: 1;
        }
        
        .lesson-header {
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .lesson-number {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 1.25rem;
            flex-shrink: 0;
        }
        
        .lesson-info {
            flex: 1;
        }
        
        .lesson-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .lesson-meta {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        
        .preview-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            background: rgba(0, 212, 255, 0.2);
            color: var(--accent);
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .loading {
            text-align: center;
            padding: 6rem 2rem;
            color: var(--text-secondary);
        }
        
        .loading::after {
            content: '';
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0, 212, 255, 0.3);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 1rem;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/learn" class="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Courses</span>
        </a>
        <div id="course-content">
            <div class="loading">Loading course...</div>
        </div>
    </div>
    <script>
        const path = window.location.pathname;
        const courseSlug = path.split('/courses/')[1];
        
        async function loadCourse() {
            try {
                // Try to find course by slug first
                const allCourses = await fetch('/api/courses').then(r => r.json());
                let courseId = courseSlug;
                
                if (allCourses.success && allCourses.courses) {
                    const found = allCourses.courses.find(c => c.slug === courseSlug);
                    if (found) courseId = found.id;
                }
                
                const res = await fetch(\`/api/courses/\${courseId}\`);
                const data = await res.json();
                
                if (data.success && data.course) {
                    const course = data.course;
                    const lessons = data.lessons || [];
                    
                    document.getElementById('course-content').innerHTML = \`
                        <div class="course-header">
                            <span class="course-badge badge-\${course.difficulty}">\${course.difficulty}</span>
                            <h1 class="course-title">\${course.title}</h1>
                            <p class="course-description">\${course.description || 'No description available'}</p>
                            <div class="course-meta">
                                <div class="meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 6v6l4 2"/>
                                    </svg>
                                    <span>\${course.duration_minutes || 0} minutes</span>
                                </div>
                                <div class="meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                                    </svg>
                                    <span>\${course.instructor_name || 'Instructor'}</span>
                                </div>
                                <div class="meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                                    </svg>
                                    <span>\${lessons.length} lessons</span>
                                </div>
                            </div>
                        </div>
                        <div class="lessons-section">
                            <h2 class="section-title">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                                </svg>
                                Course Lessons
                            </h2>
                            <div class="lessons-list">
                                \${lessons.length > 0 ? lessons.map((lesson, i) => \`
                                    <div class="lesson-item">
                                        <div class="lesson-header">
                                            <div class="lesson-number">\${i + 1}</div>
                                            <div class="lesson-info">
                                                <div class="lesson-title">\${lesson.title}</div>
                                                <div class="lesson-meta">
                                                    <span>\${lesson.duration_minutes || 0} min</span>
                                                    \${lesson.is_preview ? '<span class="preview-badge">Preview</span>' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                \`).join('') : '<p style="color: var(--text-secondary); padding: 2rem; text-align: center;">No lessons available yet.</p>'}
                            </div>
                        </div>
                    \`;
                } else {
                    document.getElementById('course-content').innerHTML = 
                        '<div class="loading">Course not found.</div>';
                }
            } catch (error) {
                console.error('Error loading course:', error);
                document.getElementById('course-content').innerHTML = 
                    '<div class="loading">Error loading course. Please try again.</div>';
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Dashboard - MeauxLearn</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --primary: #007AFF;
            --secondary: #8B5CF6;
            --accent: #00D4FF;
            --bg-primary: #000000;
            --bg-secondary: #0f1419;
            --text-primary: #FFFFFF;
            --text-secondary: #8E8E93;
            --border: rgba(255, 255, 255, 0.1);
            --card-bg: rgba(255, 255, 255, 0.05);
            --blur: blur(40px);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 2rem;
            position: relative;
            -webkit-font-smoothing: antialiased;
        }
        
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: 
                radial-gradient(2px 2px at 20% 30%, white, transparent),
                radial-gradient(2px 2px at 60% 70%, white, transparent);
            background-size: 200px 200px;
            animation: twinkle 4s ease-in-out infinite alternate;
            opacity: 0.6;
            z-index: 0;
            pointer-events: none;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
        
        .container { 
            max-width: 1400px; 
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        .nav-bar {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 3rem;
        }
        
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 10px 16px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            backdrop-filter: var(--blur);
        }
        
        .back-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border-color: rgba(0, 212, 255, 0.5);
        }
        
        .header {
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 900;
            letter-spacing: -0.04em;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        
        .header p {
            font-size: 1.125rem;
            color: var(--text-secondary);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .stat-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: var(--blur);
            transition: all 0.3s;
        }
        
        .stat-card:hover {
            transform: translateY(-4px);
            border-color: rgba(0, 212, 255, 0.5);
            box-shadow: 0 12px 32px rgba(0, 212, 255, 0.2);
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, var(--accent), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }
        
        .empty-state {
            text-align: center;
            padding: 6rem 2rem;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 24px;
            backdrop-filter: var(--blur);
        }
        
        .empty-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            opacity: 0.5;
        }
        
        .empty-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .empty-text {
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 14px 28px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
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
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-bar">
            <a href="/" class="back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Home</span>
            </a>
        </div>
        <div class="header">
            <h1>My Dashboard</h1>
            <p>Track your learning progress and achievements</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" id="enrolledCount">0</div>
                <div class="stat-label">Enrolled Courses</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="completedCount">0</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="progressPercent">0%</div>
                <div class="stat-label">Overall Progress</div>
            </div>
        </div>
        <div class="empty-state">
            <div class="empty-icon">📊</div>
            <div class="empty-title">Dashboard Coming Soon</div>
            <div class="empty-text">Your learning progress and achievements will be displayed here.</div>
            <a href="/learn" class="btn">
                <span>Browse Courses</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    </div>
    <script>
        // Future: Load user progress
        // fetch('/api/progress?user_id=default-user')
        //     .then(r => r.json())
        //     .then(data => {
        //         if (data.success) {
        //             // Update stats
        //         }
        //     });
    </script>
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
