import { siteConfig } from '@/config/site';

/**
 * Dynamic robots.txt generator.
 * - Allows all public routes
 * - Blocks admin panel from crawlers
 * - Points to sitemap
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/admin/', '/admin'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin/', '/admin'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/admin/', '/admin'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
