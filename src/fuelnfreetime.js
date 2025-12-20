export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // Check bindings availability
        const hasR2 = !!env.R2_STORAGE;
        const hasD1 = !!env.DB;

        // Simple HTML page
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fuel & Free Time</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: #E5E7EB;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
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
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 2rem;
            max-width: 800px;
        }

        .logo {
            font-size: 4rem;
            font-weight: 900;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }

        .tagline {
            font-size: 1.5rem;
            font-weight: 600;
            color: #8E8E93;
            margin-bottom: 2rem;
        }

        .description {
            font-size: 1.125rem;
            line-height: 1.8;
            color: #A0A0A5;
            margin-bottom: 3rem;
        }

        .cta-button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #007AFF, #8B5CF6);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.125rem;
            transition: all 0.3s;
            box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(0, 122, 255, 0.4);
        }

        .status {
            margin-top: 3rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 0.875rem;
            color: #8E8E93;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="logo">Fuel & Free Time</h1>
        <p class="tagline">Powered by Cloudflare Workers</p>
        <p class="description">
            Your worker is live and ready to go! 🚀<br>
            Deployed at <strong>fuelnfreetime.meauxbility.workers.dev</strong>
        </p>
        <a href="https://dash.cloudflare.com" class="cta-button" target="_blank">
            Open Cloudflare Dashboard
        </a>
        <div class="status">
            Status: ✅ Online | Worker: fuelnfreetime | Account: Meauxbility<br>
            <small style="opacity: 0.7; margin-top: 0.5rem; display: block;">
                R2 Storage: ${hasR2 ? '✅ Connected (inneranimalmedia)' : '❌ Not Available'}<br>
                D1 Database: ${hasD1 ? '✅ Connected (meaux-work-db)' : '❌ Not Available'}
            </small>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                ...corsHeaders,
                "Content-Type": "text/html;charset=UTF-8",
                "Cache-Control": "public, max-age=3600",
            },
        });
    },
};
