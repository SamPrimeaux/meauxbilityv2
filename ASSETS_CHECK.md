# 📦 Inner Animal Media - Assets Check

## ✅ Current Worker Configuration

**Worker URL**: https://inneranimalmedia.meauxbility.workers.dev  
**R2 Bucket**: `inneranimalmedia`  
**Binding**: `R2_WEBSITE`

## 📋 Expected Assets in R2

### Index Page (Required)
- `inner-animal-media-public-facing-design (1).html` - Main landing page (served at `/`)

### Dashboard & Modules
- `MEAUXGLOBE.html` - Main dashboard
- `meaux-team.html` - Team collaboration
- `meaux-doc.html` - Document management
- `meaux-photo.html` - Photo library
- `meaux-memories.html` - Memories archive
- `meaux-media.html` - Media gallery
- `meaux-cloud.html` - Cloud storage
- `meaux-cad.html` - CAD tools
- `meaux-learn.html` - Learning hub

### Public Pages (if needed)
- `about.html` - About page
- `contact.html` - Contact page
- `services.html` - Services page
- `work.html` - Work/portfolio page
- `community.html` - Community page
- `start-project.html` - Start project page

## 🔍 Current Deployment Workflow

The workflow `.github/workflows/inneranimalmedia-deploy.yml` uploads:
- ✅ MEAUXGLOBE.html
- ✅ meaux-team.html
- ✅ meaux-doc.html
- ✅ meaux-photo.html
- ✅ meaux-memories.html
- ✅ meaux-media.html
- ✅ meaux-cloud.html
- ✅ meaux-cad.html
- ✅ meaux-learn.html

**Missing**: 
- ❌ `inner-animal-media-public-facing-design (1).html` (index page)
- ❌ Public pages (about.html, contact.html, etc.)

## 🚨 Issue

The worker expects `inner-animal-media-public-facing-design (1).html` as the index page, but the workflow doesn't upload it!

## ✅ Solution

Need to:
1. Find or create the index HTML file
2. Update the workflow to upload it
3. Optionally upload public pages if they should be accessible
