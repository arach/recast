import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Get user's API key from header
    const apiKey = req.headers.get('X-OpenAI-Key');
    if (!apiKey) {
      return new Response('API key required', { status: 401 });
    }

    // Initialize OpenAI with user's key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const { 
      brandDescription, 
      visualReferences, 
      currentParams,
      requestType = 'brand-analysis'
    } = await req.json();

    // Build the system prompt
    const systemPrompt = `You are an expert brand designer for ReCast, a programmatic logo generation system.
Your role is to analyze brand descriptions and visual references to recommend specific design parameters.

ReCast uses mathematical wave functions to generate logos. Key parameters include:
- frequency: Controls pattern repetition (0.1-2.0, higher = more dynamic)
- amplitude: Controls size/intensity (20-150, higher = bolder)
- complexity: Controls detail level (0-1, higher = more intricate)
- chaos: Controls randomness (0-1, higher = more organic)
- layers: Number of visual layers (1-5)
- seed: Text that influences the pattern

Consider these aspects when analyzing:
1. Brand personality and values
2. Target audience
3. Industry conventions
4. Visual references provided
5. Emotional tone desired

Return ONLY a valid JSON object with NO additional text:
{
  "parameters": {
    "frequency": number,
    "amplitude": number,
    "complexity": number,
    "chaos": number,
    "layers": number,
    "seed": "descriptive-seed-words"
  },
  "reasoning": "Clear explanation of why these parameters match the brand",
  "confidence": 0.0-1.0,
  "suggestions": ["Additional tip 1", "Additional tip 2"]
}`;

    // Build the user prompt
    let userPrompt = `Brand Description: ${brandDescription}\n\n`;
    
    if (visualReferences && visualReferences.length > 0) {
      userPrompt += `The user has provided ${visualReferences.length} visual reference(s). Based on common logo design patterns, suggest parameters that would create a complementary design.\n\n`;
    }
    
    userPrompt += `Current parameters: ${JSON.stringify(currentParams, null, 2)}\n\n`;
    userPrompt += `Analyze this brand and recommend specific ReCast parameters that would create an appropriate logo.`;

    // Create the completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
    });

    // Convert to stream
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
    
  } catch (error: any) {
    console.error('AI Brand Consultant error:', error);
    
    if (error?.status === 401) {
      return new Response('Invalid API key', { status: 401 });
    }
    
    return new Response('Failed to analyze brand', { status: 500 });
  }
}