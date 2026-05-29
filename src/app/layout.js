import { siteConfig } from '@/config/site';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

// ─── Server-side Metadata (crawlers see this immediately) ─────
export const metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.creator,

  icons: {
    icon: '/favicon.svg',
  },

  // ─── Robots ─────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ─── Open Graph ─────────────────────────────────────────
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: `${siteConfig.name} — Portfolio`,
    firstName: 'Navaneet',
    lastName: 'Sharma',
    username: siteConfig.username,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Navaneet Sharma — MERN Stack & Full Stack Developer`,
      },
    ],
  },

  // ─── Twitter Card ───────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    images: [siteConfig.ogImage],
  },

  // ─── Canonical ──────────────────────────────────────────
  alternates: {
    canonical: siteConfig.url,
  },

  // ─── Search Engine Verification ─────────────────────────
  verification: {
    google: 'hfySI6ZMZ2zpodzbwNJ1OQ08GppaBs2tVWdEO0qI8l0',
  },

  // ─── Other Meta ─────────────────────────────────────────
  other: {
    'theme-color': siteConfig.themeColor,
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteConfig.name,
  },
};

export default function RootLayout({ children }) {

  // ─── JSON-LD: Person Schema (Google Knowledge Panel) ─────
  // sameAs with exact LinkedIn + GitHub URLs is how Google links
  // your site to your social profiles in search results.
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: 'Navaneet Sharma',
    givenName: 'Navaneet',
    familyName: 'Sharma',
    alternateName: [
      'navaneetsharma22',
      'Navaneet Sharma Developer',
      'navaneet sharma mern developer',
      'navaneet full stack developer',
    ],
    url: siteConfig.url,
    image: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/assets/navaneet.jpg`,
      width: 800,
      height: 1000,
      caption: 'Navaneet Sharma — MERN Stack Developer',
    },
    // sameAs tells Google that navaneetsharma22 on GitHub == this website's person
    sameAs: [
      'https://github.com/navaneetsharma22',
      'https://www.linkedin.com/in/navaneet-sharma-750b50357/',
      'https://x.com/NavaneetSh79884',
      'https://leetcode.com/u/NavaneetSharma/',
      'https://medium.com/@navaneetsharma26',
      'https://www.naukri.com/code360/profile/Navaneet',
      siteConfig.url,
    ],
    jobTitle: 'MERN Stack Developer',
    description: siteConfig.description,
    knowsAbout: [
      'React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB',
      'JavaScript', 'TypeScript', 'Tailwind CSS', 'Redux', 'GSAP',
      'Framer Motion', 'REST API', 'MERN Stack', 'Full Stack Development',
      'Web Development', 'UI/UX Design',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'MERN Stack Developer',
      occupationLocation: { '@type': 'Country', name: 'India' },
      skills: 'React.js, Next.js, Node.js, Express.js, MongoDB, JavaScript, TypeScript, Tailwind CSS, GSAP, Framer Motion, REST API',
    },
    knowsLanguage: ['en', 'hi'],
    nationality: { '@type': 'Country', name: 'India' },
    worksFor: { '@type': 'Organization', name: 'Freelance' },
    address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  };

  // ─── JSON-LD: WebSite Schema ──────────────────────────────
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: 'Navaneet Sharma — Portfolio',
    alternateName: [
      'navaneetsharma22 portfolio',
      'navaneet sharma developer portfolio',
      'navaneetsharma.dev',
    ],
    url: siteConfig.url,
    description: siteConfig.description,
    author: { '@id': `${siteConfig.url}/#person` },
    publisher: { '@id': `${siteConfig.url}/#person` },
    inLanguage: 'en-US',
    // Sitelinks search box hint for Google
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // ─── JSON-LD: ProfilePage Schema ─────────────────────────
  // This directly signals to Google that this is a developer profile page
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteConfig.url}/#profilepage`,
    name: 'Navaneet Sharma — Developer Portfolio',
    url: siteConfig.url,
    description: siteConfig.description,
    mainEntity: { '@id': `${siteConfig.url}/#person` },
    about: { '@id': `${siteConfig.url}/#person` },
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString(),
    inLanguage: 'en-US',
  };

  // ─── JSON-LD: BreadcrumbList ───────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${siteConfig.url}/#breadcrumb`,
    itemListElement: siteConfig.navigation.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data — 4 schemas for maximum Google coverage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }`,
          }}
        />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
