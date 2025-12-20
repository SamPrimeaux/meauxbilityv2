// Meauxbility Tenant Worker
// Serves meauxbility module UI from R2

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

        // Serve from R2 - try meauxbility specific files first, then fallback
        let r2Key = path === '/' || path === '' ? 'MEAUXGLOBE.html' : path.substring(1);
        if (!r2Key.includes('.')) r2Key += '.html';

        try {
            let object = await env.R2_STORAGE.get(r2Key);
            
            if (!object) {
                // Try alternatives
                const alternatives = ['MEAUXGLOBE.html', 'dashboard.html', 'index.html'];
                for (const alt of alternatives) {
                    object = await env.R2_STORAGE.get(alt);
                    if (object) break;
                }
            }

            if (!object) {
                return new Response('Not Found', { status: 404, headers: corsHeaders });
            }

            const contentType = r2Key.endsWith('.html') ? 'text/html' : 
                               r2Key.endsWith('.css') ? 'text/css' :
                               r2Key.endsWith('.js') ? 'application/javascript' : 'text/plain';

            return new Response(object.body, {
                headers: {
                    ...corsHeaders,
                    "Content-Type": `${contentType};charset=UTF-8`,
                },
            });
        } catch (error) {
            return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders });
        }
    },
};
