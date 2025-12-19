export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Determine the file path in R2
    let r2Key;

    if (path === "/" || path === "") {
      // Serve index.html as home
      r2Key = "index.html";
    } else if (path.startsWith("/pages/")) {
      // Serve pages/*.html files
      r2Key = path.substring(1); // Remove leading slash
    } else if (path.startsWith("/")) {
      // Try to serve as HTML file directly
      r2Key = path.substring(1);
      // If no extension, assume .html
      if (!r2Key.includes(".")) {
        r2Key += ".html";
      }
    } else {
      r2Key = path;
    }

    try {
      // Get the object from R2
      const object = await env.R2_MEAUXBILITYV2.get(r2Key);

      if (!object) {
        // Try index.html as fallback
        if (r2Key !== "index.html") {
          const fallback = await env.R2_MEAUXBILITYV2.get("index.html");
          if (fallback) {
            const html = await fallback.text();
            return new Response(html, {
              headers: {
                ...corsHeaders,
                "Content-Type": "text/html;charset=UTF-8",
              },
            });
          }
        }

        return new Response("Not Found", {
          status: 404,
          headers: corsHeaders,
        });
      }

      // Determine content type
      const contentType = getContentType(r2Key);

      // Get the object body
      const body = await object.text();

      return new Response(body, {
        headers: {
          ...corsHeaders,
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (error) {
      console.error(`Error serving ${r2Key}:`, error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

function getContentType(path) {
  const ext = path.split(".").pop().toLowerCase();
  const types = {
    html: "text/html;charset=UTF-8",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    eot: "application/vnd.ms-fontobject",
  };
  return types[ext] || "application/octet-stream";
}
