import { siteConfig } from '@/config/site';
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
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: `${siteConfig.name} Portfolio`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — MERN Stack Developer`,
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
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteConfig.name,
  },
};

export default function RootLayout({ children }) {
  // ─── JSON-LD: Person Schema ───────────────────────────────
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: siteConfig.name,
    alternateName: [
      'navaneetsharma22',
      'Navaneet Sharma',
      'navaneet developer',
      'navaneet sharma developer',
    ],
    url: siteConfig.url,
    image: `${siteConfig.url}/assets/navaneet.jpg`,
    sameAs: Object.values(siteConfig.links),
    jobTitle: [
      'MERN Stack Developer',
      'Full Stack Developer',
      'Frontend Developer',
      'Backend Developer',
      'Software Engineer',
      'Web Developer',
    ],
    description: siteConfig.description,
    knowsAbout: [
      'React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB',
      'JavaScript', 'TypeScript', 'Tailwind CSS', 'Redux', 'GSAP',
      'Framer Motion', 'REST API', 'MERN Stack', 'Full Stack Development',
      'UI/UX Design', 'Web Development',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'MERN Stack Developer',
      skills: 'React, Next.js, Node.js, Express.js, MongoDB, TypeScript, JavaScript, Tailwind CSS, Redux, GSAP, Framer Motion',
    },
    knowsLanguage: ['en', 'hi'],
    worksFor: { '@type': 'Organization', name: 'Freelance' },
    address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  };

  // ─── JSON-LD: WebSite Schema ──────────────────────────────
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: `${siteConfig.name} — Portfolio`,
    alternateName: [
      'navaneet sharma portfolio',
      'navaneet developer portfolio',
      'navaneetsharma.dev',
    ],
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { '@id': `${siteConfig.url}/#person` },
    inLanguage: 'en-US',
  };

  // ─── JSON-LD: SiteNavigationElement ───────────────────────
  const navigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${siteConfig.url}/#site-navigation`,
    name: siteConfig.navigation.map(item => item.name),
    url: siteConfig.navigation.map(item => `${siteConfig.url}${item.path}`),
  };

  return (
    <html lang="en">
      <head>
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data */}
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
