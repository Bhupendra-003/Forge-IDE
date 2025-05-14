import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': `${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
      }),
    });
    const data = await response.json();
    console.log('Gemini API response:', data);

    // Extract the response text from the Gemini API response structure
    let aiResponse = '';

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      // Extract text from the parts array in the content
      const parts = data.candidates[0].content.parts;
      if (parts && parts.length > 0) {
        aiResponse = parts[0].text || '';
      }
    }

    // If we couldn't extract a response, provide a fallback
    if (!aiResponse) {
      console.error('Could not extract response from Gemini API:', data);
      aiResponse = 'Sorry, I couldn\'t generate a response at this time.';
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in AI API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}