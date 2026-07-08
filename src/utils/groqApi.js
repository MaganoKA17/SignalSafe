const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const analyzePost = async (postText) => {
  console.log("API Key:", process.env.REACT_APP_GROQ_API_KEY);
  console.log("Post text:", postText);
  
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

Return only valid JSON, no extra text, no markdown.`
        }
      ]
    })
  });

  const data = await response.json();
  console.log("Groq API response:", data);
  
  if (!data.choices) {
    console.error("API Error:", data);
    throw new Error(data.error?.message || "Unknown API error");
  }

  const content = data.choices[0].message.content;
  return JSON.parse(content);
};