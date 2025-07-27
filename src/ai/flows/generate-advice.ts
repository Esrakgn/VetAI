'use server';

/**
 * @fileOverview Provides veterinary advice based on user queries.
 *
 * - generateAdvice - A function that generates advice for a user's question.
 * - GenerateAdviceInput - The input type for the generateAdvice function.
 * - GenerateAdviceOutput - The return type for the generateAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdviceInputSchema = z.object({
  question: z.string().describe('The user\'s question about their animal.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
});
export type GenerateAdviceInput = z.infer<typeof GenerateAdviceInputSchema>;

const GenerateAdviceOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s question.'),
});
export type GenerateAdviceOutput = z.infer<typeof GenerateAdviceOutputSchema>;

export async function generateAdvice(input: GenerateAdviceInput): Promise<GenerateAdviceOutput> {
  return generateAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdvicePrompt',
  input: {schema: GenerateAdviceInputSchema},
  output: {schema: GenerateAdviceOutputSchema},
  prompt: `You are a helpful and empathetic Veterinarian AI Assistant. Your goal is to provide clear, helpful, and safe advice to users about their animals' health and behavior.

  IMPORTANT: You are an AI assistant, not a real veterinarian. Always preface your advice with a disclaimer that the user should consult a real veterinarian for serious issues.

  Base your answers on established veterinary knowledge and protocols. Be calm, reassuring, and professional.

  Here is the conversation history:
  {{#each chatHistory}}
  - {{role}}: {{{content}}}
  {{/each}}

  Here is the user's latest question:
  "{{{question}}}"

  Provide a helpful response.
  `,
});

const generateAdviceFlow = ai.defineFlow(
  {
    name: 'generateAdviceFlow',
    inputSchema: GenerateAdviceInputSchema,
    outputSchema: GenerateAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
