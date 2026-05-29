import { siteConfig } from '@/config/site';

/**
 * Dynamic sitemap generator.
 * Includes static anchor sections and dynamic project routes.
 * All sections are listed with anchor URLs for Google to index.
 */
export default async function sitemap() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const API_URL = `${BACKEND_URL}/api`;
  const now = new Date();

  // ─── Static section routes ─────────────────────────────────
  const staticRoutes = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/#about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/#projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/#experience`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/#skills`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/#contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  // ─── Dynamic project routes (fetched from backend) ────────
  let projectRoutes = [];
  try {
    const res = await fetch(`${API_URL}/projects`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const projects = data.data || data.projects || data || [];

      projectRoutes = Array.isArray(projects)
        ? projects
            .filter((p) => p.slug)
            .map((project) => ({
              url: `${siteConfig.url}/project/${project.slug}`,
              lastModified: new Date(project.updatedAt || project.createdAt || Date.now()),
              changeFrequency: 'monthly',
              priority: 0.75,
            }))
        : [];
    }
  } catch (error) {
    console.error('Failed to fetch projects for sitemap:', error);
  }

  return [...staticRoutes, ...projectRoutes];
}
