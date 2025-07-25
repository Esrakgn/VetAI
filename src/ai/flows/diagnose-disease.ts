'use server';

/**
 * @fileOverview Diagnoses animal diseases from a photo and description.
 *
 * - diagnoseDisease - A function that diagnoses a disease from an image.
 * - DiagnoseDiseaseInput - The input type for the diagnoseDisease function.
 * - DiagnoseDiseaseOutput - The return type for the diagnoseDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A description of the animal\'s symptoms.'),
});
export type DiagnoseDiseaseInput = z.infer<typeof DiagnoseDiseaseInputSchema>;

const DiagnoseDiseaseOutputSchema = z.object({
  isDisease: z.boolean().describe('Whether a disease was detected or not.'),
  disease: z.string().describe('The name of the diagnosed disease. "Yok" if no disease is detected.'),
  confidence: z.string().describe('The confidence level of the diagnosis (Yüksek, Orta, Düşük).'),
  recommendation: z.string().describe('Recommended next steps for the user.'),
});
export type DiagnoseDiseaseOutput = z.infer<typeof DiagnoseDiseaseOutputSchema>;

export async function diagnoseDisease(input: DiagnoseDiseaseInput): Promise<DiagnoseDiseaseOutput> {
  return diagnoseDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseDiseasePrompt',
  input: {schema: DiagnoseDiseaseInputSchema},
  output: {schema: DiagnoseDiseaseOutputSchema},
  prompt: `You are an expert veterinarian. Analyze the provided image and description to diagnose a potential disease.

  If you detect a disease, provide its name, your confidence level (Yüksek, Orta, or Düşük), and a recommended course of action.
  If you do not detect a disease, set isDisease to false, disease to "Yok" and provide a general wellness recommendation.

  Photo: {{media url=photoDataUri}}
  Symptoms Description: {{{description}}}
  `,
});

const diagnoseDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseDiseaseFlow',
    inputSchema: DiagnoseDiseaseInputSchema,
    outputSchema: DiagnoseDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
