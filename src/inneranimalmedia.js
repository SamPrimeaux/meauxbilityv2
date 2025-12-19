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
    } else if (path === "/workers" || path === "/workers/") {
      // Serve workers page
      r2Key = "inneranimalmedia-workers.html";
    } else if (path === "/settings" || path === "/settings/") {
      // Serve settings page
      r2Key = "inneranimalmedia-settings.html";
    } else if (path.startsWith("/meaux-")) {
      // Serve meaux dashboard pages
      r2Key = path.substring(1) + ".html";
    } else if (path.startsWith("/")) {
      r2Key = path.substring(1);
      // URL decode the path
      r2Key = decodeURIComponent(r2Key);
      // Handle specific routes
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
    // Check if this is a browser request (Accept header contains text/html)
    const acceptHeader = request.headers.get("Accept") || "";
    const isBrowserRequest = acceptHeader.includes("text/html");

    if (isBrowserRequest) {
      // Serve styled HTML page
      try {
        const htmlPage = await env.R2_WEBSITE.get("inneranimalmedia-workers.html");
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
        console.error("Error serving workers HTML:", error);
      }
    }

    // Otherwise return JSON API response
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

  // AWS API endpoints
  if (path === "/api/aws/bedrock" && request.method === "POST") {
    return handleAWSBedrock(request, env, corsHeaders);
  }

  // Google API endpoints
  if (path === "/api/google/gemini" && request.method === "POST") {
    return handleGoogleGemini(request, env, corsHeaders);
  }

  // User GitHub token management
  if (path === "/api/user/github/token") {
    if (request.method === "POST") {
      return handleUserGitHubToken(request, env, corsHeaders);
    } else if (request.method === "GET") {
      return getUserGitHubToken(env, corsHeaders);
    } else if (request.method === "DELETE") {
      return deleteUserGitHubToken(env, corsHeaders);
    }
  }
  if (path === "/api/user/github/repos" && request.method === "GET") {
    return getUserGitHubRepos(request, env, corsHeaders);
  }

  return new Response("Not Found", { status: 404, headers: { ...corsHeaders, ...securityHeaders } });
}

async function getGitHubRepos(env, corsHeaders) {
  try {
    const githubToken = env.GITHUB_TOKEN;
    if (!githubToken) {
      return jsonResponse({ success: true, repos: [], count: 0, message: "GitHub token not configured" }, 200, corsHeaders);
    }

    // Clean token - remove any whitespace
    const cleanToken = githubToken.trim().replace(/\s+/g, '');

    // Try with Bearer first (for fine-grained tokens)
    let response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner", {
      headers: {
        "Authorization": `Bearer ${cleanToken}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "InnerAnimalMedia-Dashboard",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    // If Bearer fails with 401, try token format (for classic tokens)
    if (!response.ok && response.status === 401) {
      response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner", {
        headers: {
          "Authorization": `token ${cleanToken}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "InnerAnimalMedia-Dashboard"
        }
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }

      let errorMsg = `GitHub API Error (${response.status}): ${errorData.message || errorText}`;

      // More specific error messages
      if (response.status === 401) {
        errorMsg = `Authentication failed. Token may need 'repo' scope. Error: ${errorData.message || 'Check token permissions'}`;
      } else if (response.status === 403) {
        errorMsg = `Token lacks required permissions. Ensure it has 'repo' scope. Error: ${errorData.message || 'Forbidden'}`;
      }

      return jsonResponse({ success: false, error: errorMsg, status: response.status }, response.status, corsHeaders);
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

// AWS Bedrock API handler
async function handleAWSBedrock(request, env, corsHeaders) {
  try {
    // Check for AWS Bedrock token first (simpler auth)
    if (env.AWS_BEDROCK_TOKEN) {
      const body = await request.json();
      const { model = "anthropic.claude-v2", prompt, maxTokens = 1000 } = body;

      if (!prompt) {
        return jsonResponse({ success: false, error: "Prompt is required" }, 400, corsHeaders);
      }

      const bedrockUrl = `https://bedrock-runtime.us-east-1.amazonaws.com/model/${model}/invoke`;
      
      const response = await fetch(bedrockUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.AWS_BEDROCK_TOKEN}`,
        },
        body: JSON.stringify({
          inputText: prompt,
          textGenerationConfig: {
            maxTokenCount: maxTokens,
            temperature: 0.7,
            topP: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return jsonResponse({ success: false, error: `AWS Bedrock error: ${errorText}` }, response.status, corsHeaders);
      }

      const data = await response.json();
      return jsonResponse({ success: true, result: data }, 200, corsHeaders);
    }

    // Fallback: Check for AWS credentials
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_REGION) {
      return jsonResponse({ success: false, error: "AWS credentials not configured" }, 503, corsHeaders);
    }

    // For full AWS auth, would need AWS Signature V4 signing (complex)
    // For now, return error suggesting to use AWS_BEDROCK_TOKEN
    return jsonResponse({ success: false, error: "AWS Bedrock requires AWS_BEDROCK_TOKEN secret. Full AWS auth not yet implemented." }, 503, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Failed to call AWS Bedrock" }, 500, corsHeaders);
  }
}

// Google Gemini API handler
async function handleGoogleGemini(request, env, corsHeaders) {
  try {
    const geminiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
    if (!geminiKey) {
      return jsonResponse({ success: false, error: "Google/Gemini API key not configured" }, 503, corsHeaders);
    }

    const body = await request.json();
    const { prompt, model = "gemini-pro" } = body;

    if (!prompt) {
      return jsonResponse({ success: false, error: "Prompt is required" }, 400, corsHeaders);
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse({ success: false, error: `Google Gemini error: ${errorText}` }, response.status, corsHeaders);
    }

    const data = await response.json();
    return jsonResponse({ success: true, result: data }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Failed to call Google Gemini" }, 500, corsHeaders);
  }
}

// User GitHub token management - Store in KV (or R2 for now)
async function handleUserGitHubToken(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { token, userId = "default" } = body;

    if (!token) {
      return jsonResponse({ success: false, error: "GitHub token is required" }, 400, corsHeaders);
    }

    // Store token in R2 (in production, use KV or D1)
    const tokenKey = `user-github-tokens/${userId}.json`;
    const tokenData = {
      token: token,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await env.R2_WEBSITE.put(tokenKey, JSON.stringify(tokenData), {
      httpMetadata: { contentType: "application/json" },
    });

    return jsonResponse({ success: true, message: "GitHub token saved successfully" }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Failed to save GitHub token" }, 500, corsHeaders);
  }
}

async function getUserGitHubToken(env, corsHeaders) {
  try {
    const userId = "default"; // In production, get from session/auth
    const tokenKey = `user-github-tokens/${userId}.json`;
    
    const tokenObject = await env.R2_WEBSITE.get(tokenKey);
    if (!tokenObject) {
      return jsonResponse({ success: true, hasToken: false, message: "No user GitHub token configured" }, 200, corsHeaders);
    }

    const tokenData = await tokenObject.json();
    return jsonResponse({ 
      success: true, 
      hasToken: true,
      userId: tokenData.userId,
      createdAt: tokenData.createdAt,
      updatedAt: tokenData.updatedAt,
      // Don't return the actual token for security
    }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Failed to get GitHub token" }, 500, corsHeaders);
  }
}

async function deleteUserGitHubToken(env, corsHeaders) {
  try {
    const userId = "default"; // In production, get from session/auth
    const tokenKey = `user-github-tokens/${userId}.json`;
    
    await env.R2_WEBSITE.delete(tokenKey);
    return jsonResponse({ success: true, message: "GitHub token removed successfully" }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Failed to remove GitHub token" }, 500, corsHeaders);
  }
}

async function getUserGitHubRepos(request, env, corsHeaders) {
  try {
    const userId = "default"; // In production, get from session/auth
    const tokenKey = `user-github-tokens/${userId}.json`;
    
    const tokenObject = await env.R2_WEBSITE.get(tokenKey);
    if (!tokenObject) {
      return jsonResponse({ success: true, repos: [], count: 0, message: "No user GitHub token configured. Use /api/user/github/token to connect your token." }, 200, corsHeaders);
    }

    const tokenData = await tokenObject.json();
    const userToken = tokenData.token;

    // Fetch repos using user's token
    const cleanToken = userToken.trim().replace(/\s+/g, '');
    let response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner", {
      headers: {
        "Authorization": `Bearer ${cleanToken}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "InnerAnimalMedia-UserDashboard"
      }
    });

    if (!response.ok && response.status === 401) {
      response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner", {
        headers: {
          "Authorization": `token ${cleanToken}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "InnerAnimalMedia-UserDashboard"
        }
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse({ success: false, error: `Failed to fetch user repos: ${errorText}` }, response.status, corsHeaders);
    }

    const repos = await response.json();
    const repoCount = Array.isArray(repos) ? repos.length : 0;
    return jsonResponse({ success: true, repos: repos || [], count: repoCount, source: "user_token" }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Failed to fetch user GitHub repositories" }, 500, corsHeaders);
  }
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
