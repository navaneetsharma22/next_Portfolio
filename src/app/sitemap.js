import { siteConfig } from '@/config/site';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api`;

/**
 * Dynamic sitemap generator — automatically includes all project pages
 * from the backend database. No manual updates needed.
 *
 * This is one of the biggest SEO advantages over a Vite SPA.
 */
export default async function sitemap() {
  // ─── Static routes ────────────────────────────────────────
  const staticRoutes = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // ─── Dynamic project routes (fetched from backend) ────────
  let projectRoutes = [];
  try {
    const res = await fetch(`${API_URL}/projects`, {
      next: { revalidate: 3600 }, // Re-fetch every hour
    });
    if (res.ok) {
      const data = await res.json();
      const projects = data.data || data.projects || data || [];
      
      projectRoutes = projects.map((project) => ({
        url: `${siteConfig.url}/project/${project.slug}`,
        lastModified: new Date(project.updatedAt || project.createdAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch projects for sitemap:', error);
  }

  return [...staticRoutes, ...projectRoutes];
}
