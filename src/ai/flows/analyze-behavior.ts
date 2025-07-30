'use server';

/**
 * @fileOverview Analyzes video feeds to detect unusual animal behaviors.
 *
 * - analyzeBehavior - A function that analyzes animal behavior from a video feed.
 * - AnalyzeBehaviorInput - The input type for the analyzeBehavior function.
 * - AnalyzeBehaviorOutput - The return type for the analyzeBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBehaviorInputSchema = z.object({
  frames: z
    .array(z.string())
    .describe(
      "A series of frames from a video, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  behaviorDescription: z.string().describe('A description of the expected animal behaviors.'),
});
export type AnalyzeBehaviorInput = z.infer<typeof AnalyzeBehaviorInputSchema>;

const AnalyzeBehaviorOutputSchema = z.object({
  anomalies: z.array(z.string()).describe('Tespit edilen anormal davranışların bir listesi.'),
});
export type AnalyzeBehaviorOutput = z.infer<typeof AnalyzeBehaviorOutputSchema>;

export async function analyzeBehavior(input: AnalyzeBehaviorInput): Promise<AnalyzeBehaviorOutput> {
  return analyzeBehaviorFlow(input);
}

const analyzeBehaviorPrompt = ai.definePrompt({
  name: 'analyzeBehaviorPrompt',
  input: {schema: AnalyzeBehaviorInputSchema},
  output: {schema: AnalyzeBehaviorOutputSchema},
  prompt: `Hayvan davranışlarını video akışlarında analiz eden bir yapay zeka asistanısınız.

  Bir videodan bir dizi kare ve beklenen davranışın bir açıklamasını alacaksınız.
  Göreviniz, karelerde gösterilen anormal davranışları belirlemektir.
  
  {{#each frames}}
  Kare: {{media url=this}}
  {{/each}}

  Beklenen Davranış: {{{behaviorDescription}}}

  Anormallikler:
  - Video karelerinde gözlemlenen olağandışı davranışları listeleyin.
`,
});

const analyzeBehaviorFlow = ai.defineFlow(
  {
    name: 'analyzeBehaviorFlow',
    inputSchema: AnalyzeBehaviorInputSchema,
    outputSchema: AnalyzeBehaviorOutputSchema,
  },
  async input => {
    const {output} = await analyzeBehaviorPrompt(input);
    return output!;
  }
);
