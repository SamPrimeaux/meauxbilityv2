// MeauxCloud Tenant Worker
// Serves meaux-cloud.html from R2 (preserves existing UI)

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

        // Serve meaux-cloud.html from R2
        let r2Key = path === '/' || path === '' ? 'meaux-cloud.html' : path.substring(1);
        if (!r2Key.includes('.')) r2Key += '.html';

        try {
            let object = await env.R2_STORAGE.get(r2Key);
            
            if (!object && (path === '/' || path === '')) {
                object = await env.R2_STORAGE.get('meaux-cloud.html');
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
