import Groq from 'groq-sdk';
import { generateFallbackRoadmap, generateFallbackProjects } from './fallbackService.js';

// Initialize Groq lazily so process.env is loaded
let groqInstance = null;
const getGroq = () => {
  if (!groqInstance && process.env.GROQ_API_KEY) {
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqInstance;
};

export const generateRoadmapWithAI = async (goal, level, weeklyHours) => {
  const groq = getGroq();
  if (!groq) {
    console.warn('Groq API Key missing. Using fallback roadmap generator.');
    return generateFallbackRoadmap(goal, level, weeklyHours);
  }

  const prompt = `
    Act as a senior technical learning advisor.
    Generate a learning roadmap for someone who wants to learn "${goal}".
    Their current skill level is "${level}" and they can dedicate ${weeklyHours} hours per week.
    
    Return the response ONLY as a raw JSON object with the following structure:
    {
      "estimatedDuration": "X weeks",
      "steps": [
        {
          "stepNumber": 1,
          "title": "Topic Name",
          "description": "Brief description of what to learn",
          "duration": "Y weeks",
          "resources": ["Keyword or Site 1", "Keyword 2"]
        }
      ]
    }
    Make sure the JSON is valid and contains no markdown formatting like \`\`\`json.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3, // Lower temperature for more consistent JSON
    });

    let content = completion.choices[0]?.message?.content || '{}';
    
    // Clean up potential markdown blocks if the model still returns them
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedData = JSON.parse(content);
    
    // Validate basic structure
    if (!parsedData.steps || !Array.isArray(parsedData.steps)) {
      throw new Error('Invalid JSON structure returned from AI');
    }

    return {
      goal,
      level,
      weeklyHours,
      estimatedDuration: parsedData.estimatedDuration || 'Unknown',
      steps: parsedData.steps,
      aiGenerated: true
    };
  } catch (error) {
    console.error('AI Roadmap Generation Error:', error.message);
    console.log('Falling back to rule-based roadmap...');
    return generateFallbackRoadmap(goal, level, weeklyHours);
  }
};

export const generateProjectRecommendations = async (difficulty) => {
  const groq = getGroq();
  if (!groq) {
    return generateFallbackProjects(difficulty);
  }

  const prompt = `
    Suggest 3 project ideas for a software development student at the "${difficulty}" level.
    
    Return ONLY a valid JSON array with this structure, no markdown:
    [
      {
        "title": "Project Name",
        "description": "What to build and why",
        "difficulty": "${difficulty}",
        "techStack": ["Tech1", "Tech2"],
        "estimatedTime": "X days"
      }
    ]
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
    });

    let content = completion.choices[0]?.message?.content || '[]';
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error('AI Project Generation Error:', error.message);
    return generateFallbackProjects(difficulty);
  }
};

export const chatWithAI = async (messages) => {
  const groq = getGroq();
  if (!groq) {
    return "I am currently running in offline mode. I can only provide pre-defined roadmaps right now, but cannot chat. Please add a GROQ_API_KEY to enable chat.";
  }

  // Format messages for Groq API
  const formattedMessages = [
    { 
      role: 'system', 
      content: 'You are SkillPath AI, a friendly, encouraging, and highly knowledgeable technical mentor. Your goal is to help students learn programming, explain concepts simply (using analogies when helpful), and guide them on their projects. Keep answers concise but informative.' 
    },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  try {
    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error('AI Chat Error:', error.message);
    throw new Error('AI Chat failed');
  }
};

export const generateStepLesson = async (topic, description) => {
  const groq = getGroq();
  if (!groq) {
    return "AI Lesson generation is unavailable without an API key.";
  }

  const prompt = `
    You are an expert university professor and technical mentor teaching the specific topic: "${topic}".
    Context/Context details: ${description}
    
    CRITICAL QUALITY RULE: Do NOT use high-level summaries, generic templates, or placeholder definitions like "Basics of a Field" or "Key Players". Instead, deliver deep, concrete, real-world educational value tailored exactly to this topic.
    
    Structure your response cleanly using professional markdown formatting:
    1. **Detailed Overview**: Write a clear, 2-3 sentence technical breakdown explaining exactly *what* this concept is and *why* developers use it.
    2. **Core Concepts**: Provide 3-4 highly detailed, information-dense bullet points breaking down structural patterns, mechanisms, configurations, or underlying theories.
    3. **Implementation & Working Code**: Provide a real, concrete, syntax-accurate code example wrapped inside markdown code blocks (\`\`\`python, \`\`\`java, \`\`\`cpp, etc.) illustrating a real-world use case. If the topic is theoretical math or data science, write explicit formulas or computational steps.
    4. **Pro Tip**: Provide a production-level optimization trick, common gotcha, or industry best practice for this exact topic.
    
    Make the lesson highly authoritative, clear, and comprehensive for an engineering student. Keep it dense and complete, under 350 words.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.4, // Keep temperature lower for accurate code syntax formatting
    });

    return completion.choices[0]?.message?.content || "Could not generate lesson.";
  } catch (error) {
    console.error('Lesson Gen Error:', error.message);
    return "Error generating lesson.";
  }
};

export const generateStepQuiz = async (topic, description) => {
  const groq = getGroq();
  if (!groq) {
    return null;
  }

  const prompt = `
    Create a 3-question multiple-choice quiz for the topic: "${topic}".
    Context: ${description}
    
    Return ONLY a valid JSON array of objects with this structure:
    [
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Why this is correct"
      }
    ]
    Make sure the correctIndex is a 0-based integer. No markdown formatting.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
    });

    let content = completion.choices[0]?.message?.content || '[]';
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Quiz Gen Error:', error.message);
    return null;
  }
};