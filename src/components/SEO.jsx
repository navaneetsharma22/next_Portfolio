"use client";

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/site';

/**
 * Enterprise-grade SEO component.
 * Renders comprehensive meta tags, Open Graph, Twitter Cards,
 * JSON-LD structured data (Person, WebSite, SiteNavigation, Breadcrumbs),
 * and advanced robots directives.
 *
 * Inspired by sleek-portfolio's per-page metadata approach,
 * adapted for a Vite + React SPA architecture.
 */
const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage, 
  ogType = 'website',
  // Optional breadcrumb trail for sub-pages: [{ name: 'Home', path: '/' }, { name: 'Projects', path: '/#projects' }]
  breadcrumbs,
  // Additional JSON-LD schema to inject alongside defaults
  additionalSchema,
  // Set to true to prevent indexing (e.g. admin pages)
  noIndex = false,
}) => {
  const fullTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : siteConfig.title;
  const fullDescription = description || siteConfig.description;
  const fullKeywords = keywords || siteConfig.keywords.join(', ');
  const fullCanonical = canonical 
    ? `${siteConfig.url}${canonical}` 
    : siteConfig.url;
  const fullOgImage = ogImage || siteConfig.ogImage;

  // ─── JSON-LD: Person Schema ───────────────────────────────
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    "name": siteConfig.name,
    "alternateName": [
      "navaneetsharma22",
      "Navaneet Sharma",
      "navaneet developer",
      "navaneet sharma developer",
    ],
    "url": siteConfig.url,
    "image": `${siteConfig.url}/assets/navaneet.jpg`,
    "sameAs": [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
      siteConfig.links.leetcode,
      siteConfig.links.medium,
      siteConfig.links.dribbble,
    ],
    "jobTitle": [
      "MERN Stack Developer",
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "Software Engineer",
      "Web Developer",
      "React Developer",
    ],
    "description": fullDescription,
    "knowsAbout": [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "GSAP",
      "Framer Motion",
      "REST API",
      "MERN Stack",
      "Full Stack Development",
      "UI/UX Design",
      "Web Development",
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "MERN Stack Developer",
      "skills": "React, Next.js, Node.js, Express.js, MongoDB, TypeScript, JavaScript, Tailwind CSS, Redux, GSAP, Framer Motion",
    },
    "knowsLanguage": ["en", "hi"],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance",
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
    },
  };

  // ─── JSON-LD: WebSite Schema ──────────────────────────────
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    "name": `${siteConfig.name} — Portfolio`,
    "alternateName": [
      "navaneet sharma portfolio",
      "navaneet developer portfolio",
      "navaneetsharma.dev",
    ],
    "url": siteConfig.url,
    "description": siteConfig.description,
    "publisher": { "@id": `${siteConfig.url}/#person` },
    "inLanguage": "en-US",
  };

  // ─── JSON-LD: SiteNavigationElement Schema ────────────────
  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": `${siteConfig.url}/#site-navigation`,
    "name": siteConfig.navigation.map(item => item.name),
    "url": siteConfig.navigation.map(item => `${siteConfig.url}${item.path}`),
  };

  // ─── JSON-LD: BreadcrumbList Schema (for sub-pages) ───────
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${siteConfig.url}${crumb.path}`,
    })),
  } : null;

  // ─── Robots directive ─────────────────────────────────────
  const robotsContent = noIndex 
    ? "noindex, nofollow, noarchive, nosnippet, noimageindex"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return (
    <Helmet>
      {/* ─── Standard Metadata ─────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={siteConfig.author} />
      <link rel="canonical" href={fullCanonical} />

      {/* ─── Robots ────────────────────────────────────────── */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* ─── Open Graph / Facebook ─────────────────────────── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={siteConfig.name} />
      <meta property="og:site_name" content={`${siteConfig.name} Portfolio`} />
      <meta property="og:locale" content="en_US" />

      {/* ─── Twitter Card ──────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteConfig.twitterHandle} />
      <meta name="twitter:creator" content={siteConfig.twitterHandle} />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* ─── Theme Color ───────────────────────────────────── */}
      <meta name="theme-color" content={siteConfig.themeColor} />

      {/* ─── JSON-LD: Person ───────────────────────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>

      {/* ─── JSON-LD: WebSite ──────────────────────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* ─── JSON-LD: SiteNavigationElement ────────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(navigationSchema)}
      </script>

      {/* ─── JSON-LD: BreadcrumbList (conditional) ─────────── */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* ─── JSON-LD: Additional Schema (conditional) ──────── */}
      {additionalSchema && (
        <script type="application/ld+json">
          {JSON.stringify(additionalSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
