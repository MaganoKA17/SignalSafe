const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const cleanJSON = (text) => {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
};

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const compressImage = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', 0.85);
    };
    img.src = URL.createObjectURL(file);
  });
};

export const analyzeImage = async (imageFile) => {
  const compressed = await compressImage(imageFile);
  const base64 = await toBase64(compressed);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64}`
              }
            },
            {
              type: 'text',
              text: `You are an expert at detecting human trafficking and exploitative recruitment signals in job posts, event offers, and recruitment messages.

Analyze this image which may contain a job post, recruitment message, event offer, or advertisement. Look for exploitation red flags such as:
- Vague or missing employer identity
- Unrealistic pay promises
- Upfront fees required
- Housing tied to the job
- Pressure to travel or relocate
- Document or passport control
- Unclear working conditions

Return ONLY a JSON object with exactly these fields:
- title: a short title describing what the post is about
- riskLevel: "Low", "Medium", or "High"
- reasons: array of strings explaining which red flags were found
- entities: object with these fields: phone, location, recruiterName (use null if not found)

Return only valid JSON, no extra text, no markdown, no code blocks.`
            }
          ]
        }
      ],
      max_tokens: 1000
    })
  });

  const data = await response.json();
  if (!data.choices) throw new Error(data.error?.message || 'Groq API error');
  const content = data.choices[0].message.content;
  return JSON.parse(cleanJSON(content));
};

export const generateOutreach = async (analyzedPosts, userLocation) => {
  const highRiskPosts = analyzedPosts.filter(p => p.analysis?.riskLevel === 'High');
  const mediumRiskPosts = analyzedPosts.filter(p => p.analysis?.riskLevel === 'Medium');

  const postLocations = [...new Set(
    analyzedPosts
      .map(p => p.analysis?.entities?.location)
      .filter(Boolean)
  )];

  const summary = `
    Total posts analyzed: ${analyzedPosts.length}
    High risk posts: ${highRiskPosts.length}
    Medium risk posts: ${mediumRiskPosts.length}
    High risk post titles: ${highRiskPosts.map(p => p.analysis.title || 'Untitled').join(', ')}
    Locations mentioned in posts: ${postLocations.length > 0 ? postLocations.join(', ') : 'Unknown'}
    User current location: ${userLocation || 'Unknown'}
  `;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'user',
          content: `You are an expert NGO advisor specializing in human trafficking prevention with deep knowledge of regional support resources worldwide.

Based on this analysis of suspicious recruitment posts:
${summary}

Important location context:
- The user analyzing these posts is currently located in: ${userLocation || 'Unknown'}
- The suspicious posts reference these locations: ${postLocations.join(', ') || 'Unknown'}

Generate a JSON object with exactly these fields:
- urgencyLevel: "Low", "Medium", or "High"
- summary: one sentence describing the overall risk situation including relevant locations
- recommendations: array of exactly 4 specific actionable recommendations tailored to the user's location (${userLocation || 'their region'}), including real local hotlines, NGOs, or authorities where possible
- targetGroups: array of vulnerable groups that should be prioritized based on the locations involved
- immediateActions: array of exactly 3 immediate steps tailored to someone in ${userLocation || 'the user location'} who has found these suspicious posts
- locationNote: one sentence explaining whether this is a local or overseas threat and what that means for the user

Return only valid JSON, no extra text, no markdown, no code blocks.`
        }
      ],
      max_tokens: 2000
    })
  });

  const data = await response.json();
  if (!data.choices) throw new Error(data.error?.message || 'Groq API error');
  const content = data.choices[0].message.content;
  return JSON.parse(cleanJSON(content));
};