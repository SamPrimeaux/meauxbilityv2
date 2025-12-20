// Multi-Tenant Router
// Routes requests to appropriate tenant based on subdomain

const TENANTS = {
    'inneranimalmedia': {
        name: 'inneranimalmedia',
        worker: 'inneranimalmedia',
        handler: 'inneranimalmedia',
        preserveUI: true, // Don't override nonprofit UI
    },
    'southernpets': {
        name: 'southernpets',
        worker: 'southernpets',
        handler: 'southernpets',
        preserveUI: true, // Don't override nonprofit UI
    },
    'meauxlearn': {
        name: 'meauxlearn',
        worker: 'meauxlearn',
        handler: 'meauxlearn',
        preserveUI: false,
    },
    'fuelnfreetime': {
        name: 'fuelnfreetime',
        worker: 'fuelnfreetime',
        handler: 'fuelnfreetime',
        preserveUI: false,
    },
};

export function detectTenant(request) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Extract subdomain from hostname
    // e.g., inneranimalmedia.meauxbility.workers.dev -> inneranimalmedia
    const parts = hostname.split('.');
    
    // Check for workers.dev subdomain
    if (hostname.includes('.workers.dev')) {
        const subdomain = parts[0];
        if (TENANTS[subdomain]) {
            return TENANTS[subdomain];
        }
    }
    
    // Check for custom domain
    // e.g., inneranimal.dev -> inneranimalmedia
    if (parts.length === 2 && parts[1] === 'dev') {
        const domain = parts[0];
        // Map custom domains to tenants
        const domainMap = {
            'inneranimal': 'inneranimalmedia',
            'southernpets': 'southernpets',
            'meauxlearn': 'meauxlearn',
        };
        
        if (domainMap[domain] && TENANTS[domainMap[domain]]) {
            return TENANTS[domainMap[domain]];
        }
    }
    
    // Check X-Tenant-ID header (for API calls)
    const tenantHeader = request.headers.get('X-Tenant-ID');
    if (tenantHeader && TENANTS[tenantHeader]) {
        return TENANTS[tenantHeader];
    }
    
    // Default tenant (can be configured)
    return TENANTS['fuelnfreetime'] || null;
}

export function getTenantConfig(tenantId) {
    return TENANTS[tenantId] || null;
}

export function shouldPreserveUI(tenant) {
    return tenant?.preserveUI === true;
}
