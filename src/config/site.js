/**
 * Centralized Site Configuration
 * Single source of truth for all SEO, branding, and social metadata.
 * Inspired by sleek-portfolio's siteConfig pattern.
 */

const BASE_URL = "https://www.navaneetsharma.dev";

export const siteConfig = {
  // ─── Identity ──────────────────────────────────────────────
  name: "Navaneet Sharma",
  title: "Navaneet Sharma | MERN Stack Developer | Full Stack Developer | Portfolio",
  description:
    "Navaneet Sharma is a MERN Stack Developer specializing in high-performance web applications, cinematic UI designs, and scalable full-stack solutions. Based in India. Explore projects, experience, and resume.",
  url: BASE_URL,
  themeColor: "#9929fb",

  // ─── Open Graph Images ────────────────────────────────────
  ogImage: `${BASE_URL}/assets/navaneet.jpg`,
  ogImages: {
    home: `${BASE_URL}/og-home.png`,
    projects: `${BASE_URL}/og-projects.png`,
    experience: `${BASE_URL}/og-experience.png`,
    skills: `${BASE_URL}/og-skills.png`,
    contact: `${BASE_URL}/og-contact.png`,
  },

  // ─── Social Links ─────────────────────────────────────────
  links: {
    github: "https://github.com/navaneetsharma22",
    linkedin: "https://linkedin.com/in/navaneet-sharma-750b50357/",
    twitter: "https://x.com/NavaneetSh79884",
    leetcode: "https://leetcode.com/u/NavaneetSharma/",
    medium: "https://medium.com/@navaneetsharma26",
    dribbble: "https://dribbble.com/navaneet-sharma",
  },

  // ─── Twitter Handle ───────────────────────────────────────
  twitterHandle: "@NavaneetSh79884",

  // ─── Author Info ──────────────────────────────────────────
  author: "Navaneet Sharma",
  creator: "Navaneet Sharma",

  // ─── Keywords ─────────────────────────────────────────────
  // Organized by category for maximum SEO coverage
  keywords: [
    // Name variations
    "Navaneet Sharma",
    "Navaneet",
    "navaneet developer",
    "navaneet sharma developer",
    "navaneet web developer",
    "navaneet full stack",
    "navaneet react js",
    "navaneet next js",
    "navaneet mern",
    "navaneet software engineer",
    "navaneet frontend",
    "navaneet backend",
    "navaneet coder",
    "portfolio navaneet",
    "navaneet tech portfolio",
    "hire navaneet",
    "Navaneet Sharma Portfolio",
    "Navaneet Sharma personal website",
    "Navaneet Sharma developer portfolio",
    "navaneet sharma portfolio website",
    "navaneet developer portfolio",
    "portfolio navaneet sharma",
    "navaneet sharma official site",
    "navaneet sharma official website",
    "navaneet sharma online portfolio",
    "hire navaneet sharma",
    "navaneet sharma contact",
    "navaneet sharma mern",
    "navaneet sharma react js",
    "Navaneet Sharma Resume",
    "Navaneet Sharma Developer",
    "Navaneet Sharma Software Engineer",
    "Navaneet Sharma Full Stack",
    "Navaneet Sharma GitHub",
    "Navaneet Sharma LinkedIn",

    // Role keywords
    "Full Stack Developer",
    "Full Stack Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "MERN Stack Developer",
    "Software Developer",
    "Software Engineer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "MongoDB Developer",
    "Express.js Developer",
    "UI Designer",
    "UX Developer",

    // Tech stack
    "React.js",
    "Next.js",
    "Node.js",
    "MongoDB",
    "Express.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Redux",
    "GSAP",
    "Framer Motion",
    "REST API",
    "MERN Stack",
    "Vite",
    "Full Stack Development",

    // Location-based
    "Developer India",
    "Web Developer India",
    "Software Developer India",
    "Full Stack Developer India",
    "Software Engineer India",
    "Freelance Developer India",
    "MERN Stack Developer India",

    // Hiring / intent-based
    "hire full stack developer",
    "hire react developer",
    "hire MERN developer India",
    "developer portfolio website",
    "software developer portfolio",
    "best full stack developer portfolio",
    "freelance web developer",
    "creative developer portfolio",
    "modern web developer portfolio",
    "cinematic UI developer",
  ],

  // ─── Navigation (for JSON-LD SiteNavigationElement) ───────
  navigation: [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Projects", path: "/#projects" },
    { name: "Experience", path: "/#experience" },
    { name: "Skills", path: "/#skills" },
    { name: "Contact", path: "/#contact" },
  ],
};
