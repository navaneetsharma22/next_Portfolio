import { siteConfig } from '@/config/site';
import ProjectDetailClient from './ProjectDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch project data on the server for both metadata and rendering.
 */
async function getProject(slug) {
  try {
    const res = await fetch(`${API_URL}/projects/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Dynamic server-side metadata — crawlers get unique title, description,
 * OG image for EVERY project page. No JavaScript execution needed.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const title = project.title;
  const description = project.shortDescription || project.description?.substring(0, 160);
  const image = project.images?.[0] || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: [
      ...(project.techStack || []),
      siteConfig.name,
      'project',
      'portfolio',
    ],
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/project/${slug}`,
      type: 'article',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${siteConfig.url}/project/${slug}`,
    },
  };
}

/**
 * Server component — renders JSON-LD + delegates to client component.
 */
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);

  // JSON-LD for the project (rendered server-side!)
  const projectSchema = project ? {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    image: project.images?.[0],
    url: `${siteConfig.url}/project/${slug}`,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(project.techStack && { keywords: project.techStack.join(', ') }),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: `${siteConfig.url}/#projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project?.title || 'Project',
        item: `${siteConfig.url}/project/${slug}`,
      },
    ],
  };

  return (
    <>
      {projectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectDetailClient slug={slug} initialProject={project} />
    </>
  );
}
