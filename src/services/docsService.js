const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateDocFromPolicy(policyName, policyData) {
  try {
    const prompt = `
You are a cloud compliance documentation writer.
Generate a detailed Markdown document for the following compliance policy.

Policy Name: ${policyName}

Policy JSON:
${JSON.stringify(policyData, null, 2)}

Write sections:
1. Overview
2. Why this policy exists
3. What AWS risks it prevents
4. Required AWS services
5. Implementation summary
6. Audit checklist
7. Evidence required for auditors
8. Before vs after compliance comparison
9. Reviewer notes

Produce clear, professional Markdown.
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You write high-quality compliance documentation." },
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.error("❌ Documentation Generation Error:", err.message);
    return "Error generating documentation.";
  }
}

module.exports = { generateDocFromPolicy };
