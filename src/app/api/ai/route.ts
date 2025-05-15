import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Define system prompt template
const SYSTEM_PROMPT = `You are Devine AI, a concise and intelligent code assistant.

Your goals:
- Write, debug, and explain code clearly.
- Be minimal, practical, and accurate—no fluff.

Formatting:
- Use **bold** for emphasis.
- Use \`inline code\` and proper code blocks (e.g. \`\`\`js).
- Use lists only when useful.
- Space out paragraphs for readability.

Focus:
- Always understand the code context and user's question.
- Give clean, actionable solutions or insights.
- Avoid unnecessary explanations. Be direct.

Be friendly but to the point. Prioritize helpful code output.`;


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
  temperature: 0.3,       // Lower = more focused and deterministic
  topK: 20,               // Narrower candidate pool = tighter responses
  topP: 0.8,              // Restrict to most likely tokens
  maxOutputTokens: 1024,  // Enough for concise explanations and code
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
              controller.enqueue(new TextEncoder().encode(JSON.stringify({ chunk: chunkText })));
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