-- MeauxLearn Seed Data
-- Initial tenant and courses

-- Insert default tenant
INSERT OR IGNORE INTO tenants (id, name, slug, domain, created_at) VALUES
('meauxbility', 'Meauxbility', 'meauxbility', 'meauxbility.org', unixepoch());

-- Insert default admin user
INSERT OR IGNORE INTO users (id, tenant_id, email, name, role, created_at) VALUES
('admin-meauxbility', 'meauxbility', 'admin@meauxbility.org', 'Meauxbility Admin', 'admin', unixepoch());

-- Course 1: Meauxbility Platform Onboarding
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-platform-onboarding', 'meauxbility', 'Meauxbility Platform Onboarding', 'platform-onboarding', 
'Complete guide to getting started with the Meauxbility platform. Learn the fundamentals, navigation, and core features.', 
'admin-meauxbility', 'beginner', 120, 1, 1);

-- Course 2: Master Prompt Writing
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-prompt-writing', 'meauxbility', 'Master Prompt Writing', 'prompt-writing',
'Learn the art and science of writing effective prompts for AI systems. From basics to advanced techniques.',
'admin-meauxbility', 'intermediate', 90, 1, 2);

-- Course 3: Understanding MCP
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-mcp', 'meauxbility', 'Understanding MCP', 'understanding-mcp',
'Deep dive into Model Context Protocol (MCP). Learn how to build and use MCP servers for enhanced AI interactions.',
'admin-meauxbility', 'intermediate', 60, 1, 3);

-- Course 4: What is CLI?
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-cli', 'meauxbility', 'What is CLI?', 'what-is-cli',
'Introduction to Command Line Interface. Master terminal commands and boost your productivity.',
'admin-meauxbility', 'beginner', 45, 1, 4);

-- Course 5: What is CI/CD?
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-cicd', 'meauxbility', 'What is CI/CD?', 'what-is-cicd',
'Continuous Integration and Continuous Deployment explained. Automate your development workflow.',
'admin-meauxbility', 'intermediate', 75, 1, 5);

-- Course 6: What is Next.js?
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-nextjs', 'meauxbility', 'What is Next.js?', 'what-is-nextjs',
'Learn Next.js, the React framework for production. Build fast, scalable web applications.',
'admin-meauxbility', 'intermediate', 90, 1, 6);

-- Course 7: What is Cloudflare?
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-cloudflare', 'meauxbility', 'What is Cloudflare?', 'what-is-cloudflare',
'Comprehensive guide to Cloudflare services. Workers, R2, D1, and more.',
'admin-meauxbility', 'intermediate', 60, 1, 7);

-- Course 8: What is CRUD?
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-crud', 'meauxbility', 'What is CRUD?', 'what-is-crud',
'Create, Read, Update, Delete operations explained. Foundation of database interactions.',
'admin-meauxbility', 'beginner', 30, 1, 8);

-- Course 9: Inline Commands
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-inline-commands', 'meauxbility', 'Inline Commands', 'inline-commands',
'Master inline commands for efficient development. Speed up your workflow with powerful shortcuts.',
'admin-meauxbility', 'beginner', 45, 1, 9);

-- Course 10: Prompt Engineering
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-prompt-engineering', 'meauxbility', 'Prompt Engineering', 'prompt-engineering',
'Advanced prompt engineering techniques. Get the most out of AI systems with expert strategies.',
'admin-meauxbility', 'advanced', 120, 1, 10);

-- Course 11: What is KV?
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-kv', 'meauxbility', 'What is KV?', 'what-is-kv',
'Key-Value storage explained. Learn when and how to use KV stores in your applications.',
'admin-meauxbility', 'intermediate', 45, 1, 11);

-- Course 12: What is API?
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-api', 'meauxbility', 'What is API?', 'what-is-api',
'Application Programming Interfaces demystified. Build and consume APIs like a pro.',
'admin-meauxbility', 'intermediate', 90, 1, 12);

-- Course 13: Scaling from Idea to Application
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-scaling', 'meauxbility', 'Scaling from Idea to Application', 'scaling-idea-to-app',
'Complete guide to taking your idea from concept to production. Real-world strategies and best practices.',
'admin-meauxbility', 'advanced', 180, 1, 13);

-- Course 14: A-Z Development Guide
INSERT OR IGNORE INTO courses (id, tenant_id, title, slug, description, instructor_id, difficulty, duration_minutes, is_published, sort_order) VALUES
('course-az-guide', 'meauxbility', 'A-Z Development Guide', 'a-z-development-guide',
'Complete development guide from idea to multi-tenant full stack applications. Everything you need to know.',
'admin-meauxbility', 'advanced', 300, 1, 14);

-- Sample lessons for Platform Onboarding course
INSERT OR IGNORE INTO lessons (id, course_id, title, slug, content, sort_order, is_preview) VALUES
('lesson-onboarding-1', 'course-platform-onboarding', 'Welcome to Meauxbility', 'welcome',
'# Welcome to Meauxbility\n\nWelcome to the Meauxbility platform! This course will guide you through everything you need to know.\n\n## What You''ll Learn\n\n- Platform navigation\n- Core features\n- Best practices', 1, 1),
('lesson-onboarding-2', 'course-platform-onboarding', 'Getting Started', 'getting-started',
'# Getting Started\n\nLet''s dive into the platform and get you set up.\n\n## First Steps\n\n1. Create your profile\n2. Explore the dashboard\n3. Join your first project', 2, 0);
