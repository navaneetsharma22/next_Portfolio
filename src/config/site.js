/**
 * Centralized Site Configuration
 * Single source of truth for all SEO, branding, and social metadata.
 */

const BASE_URL = "https://www.navaneetsharma.dev";

export const siteConfig = {
  // ─── Identity ──────────────────────────────────────────────
  name: "Navaneet Sharma",
  shortName: "NavaneetSharma",
  username: "navaneetsharma22",
  title: "Navaneet Sharma — MERN Stack & Full Stack Developer | Portfolio",
  description:
    "Navaneet Sharma (navaneetsharma22) is a Full Stack MERN Developer from India specializing in React.js, Next.js, Node.js, and MongoDB. Explore projects, experience, resume, and get in touch.",
  url: BASE_URL,
  themeColor: "#9929fb",

  // ─── Open Graph Images ────────────────────────────────────
  ogImage: `${BASE_URL}/assets/navaneet.jpg`,

  // ─── Social Links — must EXACTLY match your profile URLs ──
  links: {
    github:   "https://github.com/navaneetsharma22",
    linkedin: "https://www.linkedin.com/in/navaneet-sharma-750b50357/",
    twitter:  "https://x.com/NavaneetSh79884",
    leetcode: "https://leetcode.com/u/NavaneetSharma/",
    medium:   "https://medium.com/@navaneetsharma26",
    dribbble: "https://dribbble.com/navaneet-sharma",
    code360:  "https://www.naukri.com/code360/profile/Navaneet",
  },

  // ─── Twitter Handle ───────────────────────────────────────
  twitterHandle: "@NavaneetSh79884",

  // ─── Author Info ──────────────────────────────────────────
  author: "Navaneet Sharma",
  creator: "Navaneet Sharma",

  // ─── Keywords ─────────────────────────────────────────────
  keywords: [
    // Exact-match name searches (highest priority)
    "Navaneet Sharma",
    "navaneetsharma22",
    "navaneet sharma developer",
    "navaneet sharma mern developer",
    "navaneet sharma full stack developer",
    "navaneet sharma react developer",
    "navaneet sharma next.js developer",
    "navaneet sharma software engineer",
    "navaneet sharma github",
    "navaneet sharma linkedin",
    "navaneet sharma portfolio",
    "navaneet sharma india",
    "navaneet sharma web developer",
    "navaneet sharma portfolio website",
    "navaneet sharma resume",
    "navaneet sharma projects",
    "navaneet sharma hire",
    "navaneet sharma contact",
    "navaneet sharma official",
    "navaneet developer",
    "navaneet mern stack",
    "navaneet react js",
    "navaneet next js",
    "navaneet node js",
    "navaneet coder",
    "navaneet frontend",
    "navaneet backend",
    "navaneet portfolio",
    "hire navaneet",
    "hire navaneet sharma",

    // Role + skill searches
    "MERN Stack Developer",
    "Full Stack Developer",
    "Full Stack Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "JavaScript Developer",
    "MongoDB Developer",
    "Express.js Developer",
    "Software Developer",
    "Software Engineer",
    "Web Developer",
    "UI Developer",
    "API Developer",

    // Tech stack
    "React.js",
    "Next.js",
    "Node.js",
    "MongoDB",
    "Express.js",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS",
    "Redux",
    "GSAP",
    "Framer Motion",
    "REST API",
    "MERN Stack",

    // Location-based
    "Developer India",
    "Web Developer India",
    "Full Stack Developer India",
    "MERN Stack Developer India",
    "Freelance Developer India",
    "Software Engineer India",

    // Hiring intent
    "hire full stack developer",
    "hire react developer india",
    "hire mern developer",
    "developer portfolio website",
    "best portfolio 2025",
    "creative developer portfolio",
    "cinematic portfolio",
  ],

  // ─── Navigation (for JSON-LD SiteNavigationElement) ───────
  navigation: [
    { name: "Home",       path: "/"            },
    { name: "About",      path: "/#about"      },
    { name: "Projects",   path: "/#projects"   },
    { name: "Experience", path: "/#experience" },
    { name: "Skills",     path: "/#skills"     },
    { name: "Contact",    path: "/#contact"    },
  ],
};
