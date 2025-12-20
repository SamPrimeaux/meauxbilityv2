// MeauxExplore Tenant Worker
// Exploration and discovery platform

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // Serve explore UI from R2 or embedded
        let r2Key = path === '/' || path === '' ? null : path.substring(1);
        
        if (r2Key) {
            if (!r2Key.includes('.')) r2Key += '.html';
            try {
                const object = await env.R2_STORAGE.get(r2Key);
                if (object) {
                    return new Response(object.body, {
                        headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" },
                    });
                }
            } catch (e) {}
        }

        // Default: serve embedded explore platform UI
        return serveExploreUI(env, corsHeaders);
    },
};

function serveExploreUI(env, corsHeaders) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeauxExplore - Exploration Platform</title>
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
        .hero {
            text-align: center;
            padding: 4rem 0;
        }
        h1 {
            font-size: 4rem;
            font-weight: 900;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        p { color: #8E8E93; font-size: 1.125rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>MeauxExplore</h1>
            <p>Exploration and discovery platform</p>
        </div>
    </div>
</body>
</html>`;

    return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" },
    });
}
