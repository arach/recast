import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses
export const runtime = 'edge';

export async function POST(req: Request) {
  const { 
    currentIndustry, 
    currentPreset, 
    currentParams,
    requestType = 'suggestions' // 'suggestions' | 'personality'
  } = await req.json();

  // Build context-aware prompt based on request type
  let systemPrompt = '';
  let userPrompt = '';

  if (requestType === 'suggestions') {
    systemPrompt = `You are a brand design AI assistant for ReCast, a programmatic logo generation system. 
Your role is to provide smart parameter suggestions based on the user's industry and current design choices.

Key principles:
1. Suggestions should align with industry best practices
2. Consider color psychology and brand perception
3. Suggest subtle refinements that enhance the design
4. Focus on creating memorable, distinctive identities
5. Keep suggestions specific and actionable

Current context:
- Industry: ${currentIndustry || 'general'}
- Preset: ${currentPreset}
- Current parameters: ${JSON.stringify(currentParams, null, 2)}

Provide 3-5 specific parameter adjustments with explanations.
Format as JSON array with structure: [{ parameter: string, value: any, reason: string }]`;

    userPrompt = `Based on the current design, suggest refinements that would make this logo more effective for a ${currentIndustry || 'general'} brand.`;
  } else if (requestType === 'personality') {
    systemPrompt = `You are a brand personality mapping expert for ReCast.
Your role is to translate brand personality traits into specific design parameters.

Given personality traits, suggest parameter values that express those traits visually.
Consider how mathematical properties like frequency, amplitude, and complexity relate to brand characteristics.

Format suggestions as JSON with structure: 
{
  parameters: { [key: string]: any },
  reasoning: string,
  alternativeOptions: Array<{ name: string, parameters: { [key: string]: any } }>
}`;

    userPrompt = `Map these brand personality traits to design parameters: ${JSON.stringify(currentParams.personality || [])}`;
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.7,
    maxTokens: 1000,
  });

  return result.toDataStreamResponse();
}