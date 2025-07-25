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
  videoDataUri: z
    .string()
    .describe(
      "A video of animals, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  behaviorDescription: z.string().describe('A description of the expected animal behaviors.'),
});
export type AnalyzeBehaviorInput = z.infer<typeof AnalyzeBehaviorInputSchema>;

const AnalyzeBehaviorOutputSchema = z.object({
  anomalies: z.array(z.string()).describe('A list of detected anomalous behaviors.'),
  causePrediction: z.string().describe('A ranked listing of probable causes for observed anomalies.'),
});
export type AnalyzeBehaviorOutput = z.infer<typeof AnalyzeBehaviorOutputSchema>;

export async function analyzeBehavior(input: AnalyzeBehaviorInput): Promise<AnalyzeBehaviorOutput> {
  return analyzeBehaviorFlow(input);
}

const analyzeBehaviorPrompt = ai.definePrompt({
  name: 'analyzeBehaviorPrompt',
  input: {schema: AnalyzeBehaviorInputSchema},
  output: {schema: AnalyzeBehaviorOutputSchema},
  prompt: `You are an AI assistant that analyzes animal behavior in video feeds.

  You will receive a video and a description of the expected behavior.
  Your task is to identify any anomalous behaviors and predict their probable causes.

  Video: {{media url=videoDataUri}}
  Expected Behavior: {{{behaviorDescription}}}

  Anomalies:
  - List any unusual behaviors observed in the video.

  Cause Prediction:
  - Provide a ranked listing of probable causes for the observed anomalies.
  - Consider factors such as disease, stress, and injury.
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
