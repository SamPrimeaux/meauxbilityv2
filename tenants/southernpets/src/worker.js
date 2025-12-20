// Southern Pets Animal Rescue - Nonprofit Worker
// PRESERVES original nonprofit UI - do not override

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // Serve from R2 or return placeholder
        // TODO: Add Southern Pets specific UI
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Southern Pets Animal Rescue</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #0d1520 100%);
            color: #E5E7EB;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            color: #8E8E93;
            font-size: 1.125rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Southern Pets Animal Rescue</h1>
        <p>Nonprofit platform coming soon. UI will be preserved and customized for the organization.</p>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                ...corsHeaders,
                "Content-Type": "text/html;charset=UTF-8",
            },
        });
    },
};
