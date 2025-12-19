// Shared Navigation Component for Inner Animal Media
// This can be included in all pages for consistent navigation

const SharedNav = {
  init: function () {
    this.createSidebar();
    this.loadStats();
    this.setupEventListeners();
  },

  createSidebar: function () {
    // Sidebar will be injected into pages
  },

  loadStats: async function () {
    try {
      const [workersRes, reposRes] = await Promise.all([
        fetch('/api/workers'),
        fetch('/api/github/repos')
      ]);

      const workersData = await workersRes.json();
      const reposData = await reposRes.json();

      const workersCount = workersData.success ? (workersData.count || 0) : 0;
      const reposCount = reposData.success ? (reposData.count || 0) : 0;
      const totalProjects = workersCount + reposCount;

      // Update all badge elements
      document.querySelectorAll('#workersCount, #workersCountNav').forEach(el => {
        if (el) el.textContent = workersCount;
      });
      document.querySelectorAll('#reposCount, #reposCountNav').forEach(el => {
        if (el) el.textContent = reposCount;
      });
      document.querySelectorAll('#projectsCount, #projectsCountNav, #totalProjects').forEach(el => {
        if (el) el.textContent = totalProjects;
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  },

  setupEventListeners: function () {
    // Sidebar toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-toggle, .mobile-menu-toggle')) {
        this.toggleSidebar();
      }
      if (e.target.closest('.sidebar-overlay')) {
        this.toggleSidebar();
      }
    });

    // Profile dropdown
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('profileDropdown');
      const button = document.querySelector('.profile-button');
      if (dropdown && button && !dropdown.contains(e.target) && !button.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('profileDropdown')?.classList.remove('active');
        document.getElementById('lightbox')?.classList.remove('active');
      }
    });
  },

  toggleSidebar: function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      if (overlay) overlay.classList.toggle('active');
      document.body.classList.toggle('sidebar-collapsed');
    }
  }
};

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SharedNav.init());
} else {
  SharedNav.init();
}
