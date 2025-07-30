'use server';

/**
 * @fileOverview A flow that analyzes the post-birth behavior of a newborn animal.
 *
 * - analyzeNewbornBehavior - A function that analyzes newborn behavior from video frames.
 * - AnalyzeNewbornBehaviorInput - The input type for the analyzeNewbornBehavior function.
 * - AnalyzeNewbornBehaviorOutput - The return type for the analyzeNewbornBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewbornBehaviorInputSchema = z.object({
  frames: z
    .array(z.string())
    .describe(
      "A series of frames from a video, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeNewbornBehaviorInput = z.infer<typeof AnalyzeNewbornBehaviorInputSchema>;

const AnalyzeNewbornBehaviorOutputSchema = z.object({
  sucklingBehavior: z.enum(['Evet', 'Hayır']).describe('Whether suckling behavior was observed.'),
  activityLevel: z.enum(['Aktif', 'Az', 'Yok']).describe('The activity level of the newborn.'),
  riskScore: z.number().describe('A risk score from 0 to 100.'),
  summary: z.string().describe('A summary of the observed behaviors and risk assessment.'),
  timestamps: z.object({
    firstSucklingAttempt: z.string().describe('Timestamp of the first suckling attempt. "N/A" if not observed.'),
    firstMovement: z.string().describe('Timestamp of the first significant movement or standing attempt. "N/A" if not observed.'),
  }).optional(),
});
export type AnalyzeNewbornBehaviorOutput = z.infer<typeof AnalyzeNewbornBehaviorOutputSchema>;

export async function analyzeNewbornBehavior(input: AnalyzeNewbornBehaviorInput): Promise<AnalyzeNewbornBehaviorOutput> {
  return analyzeNewbornBehaviorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNewbornBehaviorPrompt',
  input: {schema: AnalyzeNewbornBehaviorInputSchema},
  output: {schema: AnalyzeNewbornBehaviorOutputSchema},
  prompt: `You are an expert AI veterinarian specializing in neonatal livestock care. Your task is to analyze a sequence of video frames to assess the health and viability of a newborn animal (e.g., a calf) based on its behavior within the first couple of hours after birth.

  Analyze the provided frames based on these critical behaviors:
  1.  **Suckling Behavior (Emme Davranışı):**
      - Look for the newborn approaching the mother's udder and attempting to suckle.
      - An attempt is defined as the newborn's head being near the udder for at least 10 seconds.
      - If suckling behavior is observed, set "sucklingBehavior" to "Evet".
      - If no suckling is observed within the provided frames (representing the first hour), set it to "Hayır".

  2.  **Activity Level (Hareketlilik Durumu):**
      - Observe if the newborn makes any attempt to stand or walk. This is "Aktif" (healthy movement).
      - If the newborn only moves its head or legs slightly but does not attempt to stand, this is "Az" (low activity).
      - If the newborn is completely still for a prolonged period (e.g., 30 minutes in real-time context), this is "Yok" (immobile).

  3.  **Risk Score (Risk Skoru):**
      - Calculate a risk score from 0 to 100 based on the observations.
      - **Yüksek Risk (70-100):** No suckling ("Hayır") AND immobile ("Yok"). This is a critical situation.
      - **Orta Risk (40-69):** Suckling observed ("Evet") but the animal is largely immobile ("Yok" or "Az"), OR no suckling is observed ("Hayır") but the animal is active ("Aktif").
      - **Düşük Risk (0-39):** Suckling observed ("Evet") AND the animal is active ("Aktif"). This indicates normal, healthy behavior.

  {{#each frames}}
  Frame: {{media url=this}}
  {{/each}}
  
  Based on your analysis, provide the following:
  - **sucklingBehavior**: "Evet" or "Hayır".
  - **activityLevel**: "Aktif", "Az", or "Yok".
  - **riskScore**: A number between 0 and 100.
  - **summary**: A brief text summary of your findings, explaining the reason for the risk score.
  - **timestamps**: (Optional) If possible, provide the timestamps for when the behaviors were first observed.
`,
});

const analyzeNewbornBehaviorFlow = ai.defineFlow(
  {
    name: 'analyzeNewbornBehaviorFlow',
    inputSchema: AnalyzeNewbornBehaviorInputSchema,
    outputSchema: AnalyzeNewbornBehaviorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
