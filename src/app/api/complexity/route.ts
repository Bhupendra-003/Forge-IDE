import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Define the prompt for complexity analysis
    const prompt = `Analyze the following code and determine its time complexity. 
    Return a JSON object with two fields: 
    1. "complexity" - the exact time complexity (e.g., "O(n)", "O(n log n)", "O(1)")
    2. "category" - the general complexity category (one of: "CONSTANT", "LOGARITHMIC", "LINEAR", "LINEARITHMIC", "QUADRATIC", "EXPONENTIAL", "FACTORIAL")
    
    Example response: 
    {
      "complexity": "O(n^2)",
      "category": "QUADRATIC"
    }
    
    Code to analyze:
    \`\`\`
    ${code}
    \`\`\``;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }
    
    const complexityData = JSON.parse(jsonMatch[0]);
    
    return NextResponse.json(complexityData);
    
  } catch (error) {
    console.error('Error analyzing complexity:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze code complexity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
