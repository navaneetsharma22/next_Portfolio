import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Rate limiting: track requests per IP (in-memory, resets on server restart)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

// Navaneet's portfolio context — used as system prompt
const PORTFOLIO_CONTEXT = `
You are Navaneet Sharma's intelligent portfolio assistant. Here is everything about him:

NAME: Navaneet Sharma (also known online as navaneetsharma22)
ROLE: MERN Stack & Full Stack Developer
LOCATION: India
EMAIL: navaneetsharma26@gmail.com
GITHUB: https://github.com/navaneetsharma22
LINKEDIN: https://www.linkedin.com/in/navaneet-sharma-750b50357/
PORTFOLIO: https://www.navaneetsharma.dev

SKILLS:
- Frontend: React.js, Next.js, TypeScript, JavaScript, Tailwind CSS, Redux, Framer Motion, GSAP, HTML5, CSS3
- Backend: Node.js, Express.js, REST APIs, MongoDB, Mongoose
- Tools: Git, GitHub, VS Code, Postman, Figma (basics), Vercel, Render
- Concepts: MERN Stack, SSR/SSG, JWT Auth, API Design, Responsive Design, Animations, SEO

PERSONALITY: Passionate developer who loves cinematic UI design, performance optimization, and building beautiful, scalable applications. Always available for new projects. Friendly, collaborative, and detail-oriented.

EXPERIENCE: Full Stack Developer (Freelance), building full MERN stack web applications, portfolios, dashboards, and APIs.

AVAILABILITY: Currently available for freelance and full-time opportunities.
`;

const SYSTEM_PROMPTS = {
  chatbot: `${PORTFOLIO_CONTEXT}
Your role: Answer questions about Navaneet Sharma ONLY based on the above context. Be friendly, concise (max 3 sentences per answer), and professional. Never make up information. If you don't know something, say "Navaneet hasn't shared that yet, but you can reach him at navaneetsharma26@gmail.com".`,

  recruiter: `${PORTFOLIO_CONTEXT}
Your role: Analyze the provided job description and tell the recruiter why Navaneet is a great fit. 
Format your response as JSON: { "matchScore": <0-100>, "matchingSKills": ["skill1", "skill2"...], "keyStrengths": ["strength1"...], "summary": "2-sentence match summary", "recommendation": "1-sentence closing recommendation" }`,

  explain: `${PORTFOLIO_CONTEXT}
Your role: Explain the given project description in two different modes:
- "simple": Write 2 sentences a 10-year-old would understand. Use everyday analogies. No tech jargon.
- "dev": Write 3 sentences for a Senior Developer audience. Use technical terms, architecture details.
Format as JSON: { "simple": "...", "dev": "..." }`,

  coverletter: `${PORTFOLIO_CONTEXT}
Your role: Write a professional, personalized 3-paragraph cover letter FROM Navaneet Sharma's perspective for the given company and role. Make it confident, specific to their context, and highlight the most relevant skills. Keep each paragraph to 3-4 sentences. Sign off with "Best regards, Navaneet Sharma".`,

  roast: `${PORTFOLIO_CONTEXT}
Your role: Playfully "roast" the given tech stack in a funny but respectful way, then naturally transition into why Navaneet's MERN stack skills would complement or modernize it. Keep it light, fun, and end on a positive note. Max 4 sentences. Use 1-2 emojis.`,
};

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again in a minute.' }, { status: 429 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 });
    }

    const { feature, payload } = await request.json();

    if (!SYSTEM_PROMPTS[feature]) {
      return NextResponse.json({ error: 'Invalid feature type.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPTS[feature],
    });

    const result = await model.generateContent(payload);
    const text = result.response.text();

    // For JSON-expecting features, parse the response
    if (['recruiter', 'explain'].includes(feature)) {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
        return NextResponse.json({ result: parsed });
      } catch {
        return NextResponse.json({ result: text });
      }
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('[AI Route Error]', error);
    return NextResponse.json({ error: 'AI request failed. Please try again.' }, { status: 500 });
  }
}
