require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateFixForCheck(check) {
  try {
    const prompt = `
You are an AWS Cloud Security Expert.
Explain how to fix this AWS security compliance failure:

Title: ${check.CheckTitle}
Severity: ${check.Severity}
Status: ${check.Status}
Resource: ${check.ResourceId}

Provide:
1. Root cause
2. Detailed step-by-step remediation
3. AWS Console steps
4. AWS CLI commands
5. Risk prevented
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // ✅ VERIFIED WORKING MODEL
      messages: [
        { role: "system", content: "You respond with actionable AWS security remediation steps." },
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.error("❌ AI Fix Generation Error (Groq):", err.message);
    return "Error generating fix from Groq.";
  }
}

module.exports = { generateFixForCheck };
