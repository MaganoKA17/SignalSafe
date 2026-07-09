const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const cleanJSON = (text) => {
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
};

export const analyzePost = async (postText) => {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are an expert at detecting human trafficking and exploitative recruitment signals in job posts.

Analyze this post and return ONLY a JSON object with exactly these fields:
- riskLevel: "Low", "Medium", or "High"
- reasons: array of strings explaining why
- entities: object with these fields: phone, location, recruiterName

Post: ${postText}

Return only valid JSON, no extra text, no markdown, no code blocks.`
        }
      ]
    })
  });

  const data = await response.json();
  if (!data.choices) throw new Error(data.error?.message || "Groq API error");
  const content = data.choices[0].message.content;
  return JSON.parse(cleanJSON(content));
};

export const generateOutreach = async (analyzedPosts) => {
  const highRiskPosts = analyzedPosts.filter(p => p.analysis?.riskLevel === 'High');
  const mediumRiskPosts = analyzedPosts.filter(p => p.analysis?.riskLevel === 'Medium');

  const summary = `
    Total posts analyzed: ${analyzedPosts.length}
    High risk posts: ${highRiskPosts.length}
    Medium risk posts: ${mediumRiskPosts.length}
    High risk post titles: ${highRiskPosts.map(p => p.title).join(', ')}
  `;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert NGO advisor specializing in human trafficking prevention.

Based on this analysis of suspicious recruitment posts:
${summary}

Generate a JSON object with exactly these fields:
- urgencyLevel: "Low", "Medium", or "High"
- summary: one sentence describing the overall risk situation
- recommendations: array of exactly 4 specific actionable recommendations for NGO outreach workers
- targetGroups: array of vulnerable groups that should be prioritized
- immediateActions: array of exactly 3 immediate steps to take right now

Return only valid JSON, no extra text, no markdown, no code blocks.`
        }
      ]
    })
  });

  const data = await response.json();
  if (!data.choices) throw new Error(data.error?.message || "Groq API error");
  const content = data.choices[0].message.content;
  return JSON.parse(cleanJSON(content));
};