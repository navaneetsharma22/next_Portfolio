import React from 'react';
import ClientHome from './ClientHome';

// Ensure this page is dynamically rendered if the API updates, or revalidated.
export const revalidate = 3600; // Revalidate every hour

async function getInitialData() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const API_URL = `${BACKEND_URL}/api`;

  try {
    const [heroRes, aboutRes, projectsRes, expRes, skillsRes] = await Promise.all([
      fetch(`${API_URL}/hero`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/about`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/projects`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/experience`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/skills`, { next: { revalidate: 3600 } }).catch(() => null),
    ]);

    const hero = heroRes && heroRes.ok ? await heroRes.json().catch(() => null) : null;
    const about = aboutRes && aboutRes.ok ? await aboutRes.json().catch(() => null) : null;
    const projectsData = projectsRes && projectsRes.ok ? await projectsRes.json().catch(() => ({ projects: [] })) : { projects: [] };
    const experience = expRes && expRes.ok ? await expRes.json().catch(() => []) : [];
    const skills = skillsRes && skillsRes.ok ? await skillsRes.json().catch(() => []) : [];

    return {
      hero: hero || null,
      about: about || null,
      projects: projectsData?.projects || projectsData || [],
      experience: experience || [],
      skills: skills || []
    };
  } catch (error) {
    console.error("SSR Fetch failed:", error);
    return { hero: null, about: null, projects: [], experience: [], skills: [] };
  }
}

export default async function HomePage() {
  const initialData = await getInitialData();
  return <ClientHome initialData={initialData} />;
}
