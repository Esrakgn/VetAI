'use server';

/**
 * @fileOverview Detects animal birth from video feeds.
 *
 * - detectBirth - A function that analyzes video frames to detect a birth event.
 * - DetectBirthInput - The input type for the detectBirth function.
 * - DetectBirthOutput - The return type for the detectBirth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectBirthInputSchema = z.object({
  frames: z
    .array(z.string())
    .describe(
      "A series of frames from a video, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectBirthInput = z.infer<typeof DetectBirthInputSchema>;

const DetectBirthOutputSchema = z.object({
  isBirthDetected: z.boolean().describe('Whether a birth was detected (Evet/Hayır).'),
  estimatedBirthTime: z.string().describe('The estimated timestamp of the birth if detected.'),
  keyFrame: z.string().describe('The data URI of the key frame showing the birth event as evidence.'),
  evidence: z.string().describe('A description of the visual evidence that supports the conclusion.'),
});
export type DetectBirthOutput = z.infer<typeof DetectBirthOutputSchema>;

export async function detectBirth(input: DetectBirthInput): Promise<DetectBirthOutput> {
  return detectBirthFlow(input);
}

const detectBirthPrompt = ai.definePrompt({
  name: 'detectBirthPrompt',
  input: {schema: DetectBirthInputSchema},
  output: {schema: DetectBirthOutputSchema},
  prompt: `You are an expert AI veterinarian specializing in livestock obstetrics. Your task is to analyze a sequence of video frames from a barn or pen to detect if an animal is giving birth.

  Focus on the following key visual indicators:
  1.  **Presence of fresh blood or amniotic fluid on the ground.**
  2.  **The mother animal is in a distinct birthing position** (e.g., lying on her side, straining, visible contractions).
  3.  **The sudden appearance of a newborn animal.**
  4.  **The mother animal is intensively licking or cleaning a newborn.**

  Analyze the provided frames and determine if a birth has occurred.
  
  {{#each frames}}
  Frame: {{media url=this}}
  {{/each}}
  
  Based on your analysis, provide the following:
  - **isBirthDetected**: Answer "Evet" (Yes) or "Hayır" (No).
  - **estimatedBirthTime**: If a birth is detected, provide the current timestamp. Otherwise, state "N/A".
  - **keyFrame**: If a birth is detected, select the single best frame that serves as clear evidence (e.g., the frame showing the newborn for the first time) and return it as a data URI. If no birth is detected, return an empty string.
  - **evidence**: Briefly describe the visual evidence you used to make your determination. For example, "Yerde taze kan ve yeni doğmuş bir buzağı görüldü." or "Anne hayvan doğum pozisyonunda kasılırken görülüyor." If no birth is detected, explain why (e.g., "Doğuma dair belirgin bir kanıt bulunamadı. Hayvanlar normal davranışlar sergiliyor.").
`,
});

const detectBirthFlow = ai.defineFlow(
  {
    name: 'detectBirthFlow',
    inputSchema: DetectBirthInputSchema,
    outputSchema: DetectBirthOutputSchema,
  },
  async input => {
    const {output} = await detectBirthPrompt(input);
    return output!;
  }
);
