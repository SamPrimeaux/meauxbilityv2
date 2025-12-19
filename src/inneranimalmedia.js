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

    // Security headers
    const securityHeaders = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // API endpoints
    if (path.startsWith("/api/")) {
      return handleAPI(path, request, env, corsHeaders);
    }

    // Serve static files from R2
    let r2Key;

    if (path === "/" || path === "") {
      // Serve the new index page with galaxy design
      r2Key = "inneranimalmedia-index.html";
    } else if (path === "/dashboard" || path === "/dashboard/") {
      // Serve dashboard page
      r2Key = "inneranimalmedia-dashboard.html";
    } else if (path === "/projects" || path === "/projects/") {
      // Serve projects page
      r2Key = "inneranimalmedia-projects.html";
    } else if (path === "/agents" || path === "/agents/") {
      // Serve agents page
      r2Key = "inneranimalmedia-agents.html";
    } else if (path === "/repos" || path === "/repos/") {
      // Serve repos page
      r2Key = "inneranimalmedia-repos.html";
    } else if (path.startsWith("/")) {
      r2Key = path.substring(1);
      // URL decode the path
      r2Key = decodeURIComponent(r2Key);
      // Handle /projects route
      if (r2Key === "projects") {
        r2Key = "inneranimalmedia-projects.html";
      } else if (!r2Key.includes(".")) {
        r2Key += ".html";
      }
    } else {
      r2Key = path;
    }

    try {
      let object = await env.R2_WEBSITE.get(r2Key);

      if (!object) {
        // Try alternative key formats
        const alternatives = [
          "inneranimalmedia-index.html",
          "inner-animal-media-public-facing-design (1).html",
          "inner-animal-media-public-facing-design%20(1).html",
          "index.html"
        ];

        for (const altKey of alternatives) {
          object = await env.R2_WEBSITE.get(altKey);
          if (object) {
            r2Key = altKey;
            break;
          }
        }
      }

      if (!object) {
        return new Response(`Not Found. Tried: ${r2Key}`, {
          status: 404,
          headers: corsHeaders,
        });
      }

      const contentType = getContentType(r2Key);
      const body = await object.text();

      return new Response(body, {
        headers: {
          ...corsHeaders,
          ...securityHeaders,
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
          "X-Powered-By": "InnerAnimalMedia",
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

async function handleAPI(path, request, env, corsHeaders) {
  const securityHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };

  if (path === "/api/github/repos") {
    // Check if this is a browser request (Accept header contains text/html)
    const acceptHeader = request.headers.get("Accept") || "";
    const isBrowserRequest = acceptHeader.includes("text/html");

    if (isBrowserRequest) {
      // Serve styled HTML page
      try {
        const htmlPage = await env.R2_WEBSITE.get("inneranimalmedia-repos.html");
        if (htmlPage) {
          const htmlBody = await htmlPage.text();
          return new Response(htmlBody, {
            headers: {
              ...corsHeaders,
              ...securityHeaders,
              "Content-Type": "text/html;charset=UTF-8",
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      } catch (error) {
        console.error("Error serving repos HTML:", error);
      }
    }

    // Otherwise return JSON API response
    const response = await getGitHubRepos(env, corsHeaders);
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...securityHeaders,
      },
    });
  }

  if (path === "/api/workers") {
    const response = await getWorkers(env, corsHeaders);
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...securityHeaders,
      },
    });
  }

  if (path === "/api/health") {
    return jsonResponse({
      status: "healthy",
      service: "Inner Animal Media",
      version: "2.0.0",
      timestamp: new Date().toISOString(),
      domain: request.headers.get("host"),
    }, 200, corsHeaders);
  }

  return new Response("Not Found", { status: 404, headers: { ...corsHeaders, ...securityHeaders } });
}

async function getGitHubRepos(env, corsHeaders) {
  try {
    const githubToken = env.GITHUB_TOKEN;
    if (!githubToken) {
      return jsonResponse({ success: true, repos: [], count: 0, message: "GitHub token not configured" }, 200, corsHeaders);
    }
    
    // Try token as-is first
    let response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        "Authorization": `Bearer ${githubToken.trim()}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "InnerAnimalMedia-Dashboard"
      }
    });
    
    // If Bearer fails, try token format
    if (!response.ok && response.status === 401) {
      response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
        headers: {
          "Authorization": `token ${githubToken.trim()}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "InnerAnimalMedia-Dashboard"
        }
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `Failed to fetch GitHub repos: ${errorText}`;
      
      // Provide helpful error message
      if (response.status === 401) {
        errorMsg = "GitHub token is invalid or expired. Please update GITHUB_TOKEN secret in Cloudflare Dashboard with a valid token from https://github.com/settings/tokens";
      }
      
      return jsonResponse({ success: false, error: errorMsg }, response.status, corsHeaders);
    }
    
    const repos = await response.json();
    const repoCount = Array.isArray(repos) ? repos.length : 0;
    return jsonResponse({ success: true, repos: repos || [], count: repoCount }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Failed to fetch GitHub repositories" }, 500, corsHeaders);
  }
}

async function getWorkers(env, corsHeaders) {
  try {
    if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) {
      return jsonResponse({ success: false, error: "Cloudflare API credentials not configured" }, 503, corsHeaders);
    }
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/workers/scripts?per_page=1000`,
      {
        headers: {
          "Authorization": `Bearer ${env.CLOUDFLARE_API_TOKEN}`
        }
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse({ success: false, error: `Failed to list workers: ${errorText}` }, response.status, corsHeaders);
    }
    const data = await response.json();
    const workers = (data.result || []).map((w) => ({
      id: w.id,
      name: w.id,
      created_on: w.created_on,
      modified_on: w.modified_on,
      worker_url: `https://${w.id}.meauxbility.workers.dev`,
    }));
    return jsonResponse({ success: true, workers: workers, count: workers.length }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Failed to fetch workers" }, 500, corsHeaders);
  }
}

function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

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
