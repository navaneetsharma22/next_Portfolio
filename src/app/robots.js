import { siteConfig } from '@/config/site';

/**
 * Dynamic robots.txt generator.
 * Tailored to the portfolio's actual route structure:
 * - Public: / and /project/:slug
 * - Blocked: /admin and /admin/*
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
