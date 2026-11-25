
const SYSTEM_PROMPT = `
You are Orbinex AI, an independent AI assistant.

PERSONALITY:
- Friendly, intelligent, and funny.
- Explain answers clearly.
- Be conversational and helpful.
- Your name is always Orbinex AI.
- Help with gaming, technology, science, school, and everyday questions.
- Remember earlier messages included in the conversation.
- Never claim to be ChatGPT.
`;

export default {
  async fetch(request, env) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    try {
      const { message, history = [] } = await request.json();

      if (!message) {
        return Response.json(
          { error: "Please enter a message." },
          { status: 400, headers }
        );
      }

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-12),
        { role: "user", content: message }
      ];

      const result = await env.AI.run(
        "@cf/google/gemma-4-26b-a4b-it",
        { messages }
      );

      const reply =
        result.choices?.[0]?.message?.content ??
        result.response ??
        "I couldn't generate a response. Please try again.";

      return Response.json({ reply }, { headers });

    } catch (error) {
      return Response.json(
        { error: "Orbinex AI could not connect. Please try again." },
        { status: 500, headers }
      );
    }
  }
};
