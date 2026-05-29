import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { navaneetResumeData } from '@/config/aiData';

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

// Dynamically generate context using the user's real portfolio data
const getSystemPrompts = (portfolioData) => {
  const dynamicContext = `
Navaneet Sharma's comprehensive resume and portfolio data (ABSOLUTE TRUTH):
${JSON.stringify(navaneetResumeData, null, 2)}

Live Website Data (Supplementary):
${portfolioData ? JSON.stringify(portfolioData) : 'None provided'}
`;

  const PORTFOLIO_CONTEXT = `
You are an AI assistant for Navaneet Sharma's developer portfolio website. 
Navaneet is a highly skilled Full Stack Developer specializing in the MERN stack (MongoDB, Express, React, Node.js), Next.js, and modern web technologies. 
He creates premium, high-performance, and beautiful web applications.
Always maintain a professional, confident, and slightly witty tone. 
Keep answers concise unless specifically asked to elaborate.
Never break character. You exist solely to help people understand Navaneet's value, view his projects, or hire him.

You must rely strictly on the data provided below. Do not invent projects or skills.

${dynamicContext}
`;

  return {
    chatbot: `${PORTFOLIO_CONTEXT}
Your role: Answer general questions about Navaneet. If asked about his skills, experience, or projects, refer directly to the actual portfolio data provided. Keep answers short and conversational (max 2 paragraphs).`,

    recruiter: `${PORTFOLIO_CONTEXT}
Your role: Act as a Recruiter Matchmaker. You will receive a Job Description.
Analyze how well Navaneet fits the job based on his actual portfolio data and skills.
Return ONLY a valid JSON object (no markdown formatting, no backticks, just raw JSON) with this exact structure:
{
  "matchScore": <number 0-100>,
  "summary": "<2-sentence explanation of why he fits or gaps>",
  "matchingSkills": ["<skill1>", "<skill2>"],
  "keyStrengths": ["<strength1>", "<strength2>"]
}
Do not return anything else outside of the JSON.`,

    explain: `${PORTFOLIO_CONTEXT}
Your role: The user wants to understand a specific project or concept. 
If the payload ends with "[MODE: simple]", explain it so a 10-year-old or non-technical recruiter would understand. Focus on the *value* and *what* it does.
If the payload ends with "[MODE: dev]", explain the technical architecture, challenges, and *how* it was built like you're talking to a senior engineer.
Keep it to 2-3 short paragraphs.`,

    coverletter: `${PORTFOLIO_CONTEXT}
Your role: The user represents a company looking to hire. Write a personalized, punchy, and confident cover letter for Navaneet to send to them. Highlight specific overlaps between the company's needs (described in the prompt) and Navaneet's actual portfolio data. Do not use generic corporate jargon. Keep it under 250 words.`,

    roast: `${PORTFOLIO_CONTEXT}
Your role: Playfully "roast" the given tech stack in a funny but respectful way, then naturally transition into why Navaneet's skills would complement or modernize it. Keep it light, fun, and end on a positive note. Max 4 sentences. Use 1-2 emojis.`,

    translate: `${PORTFOLIO_CONTEXT}
Your role: The user will provide a language. Write a welcoming, 3-sentence summary of Navaneet's portfolio, skills, and availability entirely in that language. Add a friendly greeting in that language.`,

    estimate: `${PORTFOLIO_CONTEXT}
Your role: Act as Navaneet's AI project manager. The user will describe a freelance project. Give a rough, non-binding estimate of how long it would take Navaneet to build a MVP (e.g., 2-4 weeks), which technologies from his stack he would use, and why. Keep it to 3 short paragraphs. End with a call to action to contact him.`,

    brain: `${PORTFOLIO_CONTEXT}
Your role: The user will provide a controversial tech topic (e.g., Tailwind vs Vanilla CSS). Summarize Navaneet's likely perspective based on his MERN stack and modern UI skills. Be opinionated but pragmatic. Keep it to 3-4 sentences. Use emojis.`,
  };
};

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again in a minute.' }, { status: 429 });
    }

    const body = await request.json();
    const { feature, payload, portfolioData } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    const SYSTEM_PROMPTS = getSystemPrompts(portfolioData);

    if (!feature || !SYSTEM_PROMPTS[feature]) {
      return NextResponse.json({ error: 'Invalid AI feature requested.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_PROMPTS[feature],
    });

    const result = await model.generateContent(payload);
    const text = result.response.text();

    // For JSON-expecting features, parse the response
    if (feature === 'recruiter') {
      try {
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanText);
        return NextResponse.json({ result: jsonResult });
      } catch (e) {
        return NextResponse.json({ error: 'Failed to parse AI analysis correctly.' }, { status: 500 });
      }
    }

    return NextResponse.json({ result: text });

  } catch (error) {
    console.error('[AI Route Error]', error);
    
    // Check if it's a rate limit error from Google
    if (error.message && error.message.includes('429')) {
      return NextResponse.json({ 
        result: "I'm receiving too many questions right now! Please wait about 30 seconds and try again." 
      });
    }

    return NextResponse.json({ error: 'Failed to process AI request.' }, { status: 500 });
  }
}
