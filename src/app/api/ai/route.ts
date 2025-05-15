import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Define system prompt template
const SYSTEM_PROMPT = `👋 Hello! You are Devine AI — a smart, concise, and friendly code assistant.

🎯 Goals:
- Help users write, debug, and understand code.
- Keep responses practical, minimal, and accurate.
- Be warm, clear, and engaging — no fluff, no filler.

🛠️ Formatting:
- Use **bold** for emphasis.
- Use \`inline code\` for snippets.
- Use proper code blocks with language tags (e.g. \`\`\`js).
- Use bullet points and emojis to enhance readability.
- Add spacing between paragraphs and sections for clarity.

🤖 Style:
- Greet the user briefly when appropriate.
- Focus on clean, helpful code and actionable explanations.
- Keep things friendly but direct — like a great coding buddy.
- Prefer examples over theory. Avoid over-explaining.

✨ Tone:
- Be professional yet approachable.
- Don't repeat the obvious. Respect the user's intelligence.
- Use numbered or bulleted lists when helpful.
- End with a polite offer to help further, if needed.`;



// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Configure the safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Generation config
const generationConfig = {
  temperature: 0.5,        // Balanced — not too creative, not too dry
  topK: 20,                // Focused token sampling
  topP: 0.8,               // Conservative randomness
  maxOutputTokens: 2048,   // Long enough for detailed help with spacing
};



export async function POST(request: Request) {
  try {
    const { messages, stream = true } = await request.json();

    // Add system prompt to the beginning if it's not already there
    const messagesWithSystemPrompt = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.filter((m: { role: string }) => m.role !== 'system')
    ];

    // Convert messages to the format expected by the Google GenAI library
    const formattedMessages = messagesWithSystemPrompt.map((m: { role: string; content: string }) => ({
      role: m.role === 'ai' ? 'model' : m.role === 'system' ? 'user' : 'user',
      parts: [{ text: m.content }],
    }));

    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
    });

    // Create a chat session
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1), // All messages except the last one
      generationConfig,
      safetySettings,
    });

    // Get the last message (user's query)
    const lastMessage = formattedMessages[formattedMessages.length - 1];
    const query = lastMessage.parts[0].text;

    if (stream) {
      // True streaming implementation
      const result = await chat.sendMessageStream(query);

      // Create a ReadableStream to stream the response to the client
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              // Send each chunk as it arrives
              controller.enqueue(new TextEncoder().encode(JSON.stringify({ chunk: chunkText }) + '\n'));
            }
            controller.close();
          } catch (error) {
            console.error('Error in stream processing:', error);
            controller.error(error);
          }
        }
      });

      // Return a streaming response
      return new Response(readableStream, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming approach
      const result = await chat.sendMessage(query);
      const response = result.response;
      const text = response.text();

      return NextResponse.json({ response: text });
    }
  } catch (error) {
    console.error('Error in AI API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}