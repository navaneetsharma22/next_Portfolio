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

    const heroJson = heroRes && heroRes.ok ? await heroRes.json().catch(() => null) : null;
    const aboutJson = aboutRes && aboutRes.ok ? await aboutRes.json().catch(() => null) : null;
    const projectsJson = projectsRes && projectsRes.ok ? await projectsRes.json().catch(() => null) : null;
    const expJson = expRes && expRes.ok ? await expRes.json().catch(() => null) : null;
    const skillsJson = skillsRes && skillsRes.ok ? await skillsRes.json().catch(() => null) : null;

    // Process Experience
    let experience = expJson?.data || expJson || [];
    if (!Array.isArray(experience)) experience = [];
    experience = experience.sort((a, b) => {
      if (a.order !== b.order) return (a.order || 0) - (b.order || 0);
      return new Date(b.startDate || 0) - new Date(a.startDate || 0);
    });

    // Process Skills
    let skills = skillsJson?.skills || skillsJson?.data || skillsJson || [];
    if (!Array.isArray(skills)) skills = [];
    skills = skills.filter(s => s.isVisible !== false);

    return {
      hero: heroJson?.data || heroJson || null,
      about: aboutJson?.data || aboutJson || null,
      projects: projectsJson?.projects || projectsJson?.data || projectsJson || [],
      experience: experience,
      skills: skills
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
