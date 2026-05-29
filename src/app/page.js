import React from 'react';
import ClientHome from './ClientHome';
import { siteConfig } from '@/config/site';

export const revalidate = 3600; // Revalidate every hour

// ─── Dynamic per-page metadata (overrides layout defaults) ───
// Google renders this for the homepage specifically.
export async function generateMetadata() {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: siteConfig.url,
    },
    openGraph: {
      type: 'profile',
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: 'Navaneet Sharma — MERN Stack & Full Stack Developer',
        },
      ],
      firstName: 'Navaneet',
      lastName: 'Sharma',
      username: siteConfig.username,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      creator: siteConfig.twitterHandle,
      images: [siteConfig.ogImage],
    },
  };
}

async function getInitialData() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const API_URL = `${BACKEND_URL}/api`;

  try {
    const [heroRes, aboutRes, projectsRes, expRes, skillsRes] = await Promise.all([
      fetch(`${API_URL}/hero`,       { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/about`,      { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/projects`,   { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/experience`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/skills`,     { next: { revalidate: 3600 } }).catch(() => null),
    ]);

    const heroJson     = heroRes     && heroRes.ok     ? await heroRes.json().catch(()     => null) : null;
    const aboutJson    = aboutRes    && aboutRes.ok    ? await aboutRes.json().catch(()    => null) : null;
    const projectsJson = projectsRes && projectsRes.ok ? await projectsRes.json().catch(() => null) : null;
    const expJson      = expRes      && expRes.ok      ? await expRes.json().catch(()      => null) : null;
    const skillsJson   = skillsRes   && skillsRes.ok   ? await skillsRes.json().catch(()   => null) : null;

    // Process Experience — sort by order then date
    let experience = expJson?.data || expJson || [];
    if (!Array.isArray(experience)) experience = [];
    experience = experience.sort((a, b) => {
      if (a.order !== b.order) return (a.order || 0) - (b.order || 0);
      return new Date(b.startDate || 0) - new Date(a.startDate || 0);
    });

    // Process Skills — filter hidden ones
    let skills = skillsJson?.skills || skillsJson?.data || skillsJson || [];
    if (!Array.isArray(skills)) skills = [];
    skills = skills.filter(s => s.isVisible !== false);

    return {
      hero:       heroJson?.data    || heroJson    || null,
      about:      aboutJson?.data   || aboutJson   || null,
      projects:   projectsJson?.projects || projectsJson?.data || projectsJson || [],
      experience,
      skills,
    };
  } catch (error) {
    console.error('SSR Fetch failed:', error);
    return { hero: null, about: null, projects: [], experience: [], skills: [] };
  }
}

export default async function HomePage() {
  const initialData = await getInitialData();
  return <ClientHome initialData={initialData} />;
}
