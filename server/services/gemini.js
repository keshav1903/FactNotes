// server/services/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function factCheck(sentence) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a fact-checker. Analyze this sentence: "${sentence}".
    Respond with VALID JSON ONLY. No code blocks, no extra text.
    If accurate: {"status": "ok"}
    If inaccurate: {"suggestion": "Corrected sentence", "explanation": "Brief reason with source URL"}
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Log raw response for debugging
    console.log('Raw Gemini response:', responseText);

    // 1) Split into lines, 2) drop any that start/end with ```
    // 3) Join remaining lines back, trim whitespace
    const cleaned = responseText
      .split('\n')
      .filter(line => !line.trim().startsWith('```'))
      .join('')
      .trim();

    // Log cleaned text before parsing
    console.log('Cleaned response:', cleaned);

    // Try parsing JSON
    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Offending text:', cleaned);
      return { status: 'error' };
    }
  } catch (error) {
    console.error('Gemini error:', error);
    return { status: 'error' };  // Fallback to avoid crashes
  }
}

module.exports = { factCheck };
