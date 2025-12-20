// MeauxWork Tenant Worker
// Serves meaux-work related UI from R2

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

        // Serve from R2 - try meaux-work, meauxmcp, or dashboard files
        let r2Key = path === '/' || path === '' ? 'meauxmcp.html' : path.substring(1);
        if (!r2Key.includes('.')) r2Key += '.html';

        try {
            let object = await env.R2_STORAGE.get(r2Key);
            
            if (!object && (path === '/' || path === '')) {
                const alternatives = ['meauxmcp.html', 'dashboard.html', 'MEAUXGLOBE.html'];
                for (const alt of alternatives) {
                    object = await env.R2_STORAGE.get(alt);
                    if (object) break;
                }
            }

            if (!object) {
                return new Response('Not Found', { status: 404, headers: corsHeaders });
            }

            return new Response(object.body, {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "text/html;charset=UTF-8",
                },
            });
        } catch (error) {
            return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders });
        }
    },
};
