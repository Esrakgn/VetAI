'use server';

/**
 * @fileOverview A flow that detects behavioral signs of mastitis from video frames.
 *
 * - detectMastitis - A function that analyzes video frames for mastitis symptoms.
 * - DetectMastitisInput - The input type for the detectMastitis function.
 * - DetectMastitisOutput - The return type for the detectMastitis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMastitisInputSchema = z.object({
  frames: z
    .array(z.string())
    .describe(
      "A series of frames from a video, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectMastitisInput = z.infer<typeof DetectMastitisInputSchema>;

const DetectMastitisOutputSchema = z.object({
  isMastitisRisk: z.boolean().describe('Whether a risk of mastitis is detected.'),
  detectedSigns: z.array(z.string()).describe('A list of detected behavioral signs.'),
  confidence: z.string().describe('The confidence level of the diagnosis (Yüksek, Orta, Düşük).'),
  recommendation: z.string().describe('A summary and recommendation if a risk is detected.'),
});
export type DetectMastitisOutput = z.infer<typeof DetectMastitisOutputSchema>;

export async function detectMastitis(input: DetectMastitisInput): Promise<DetectMastitisOutput> {
  return detectMastitisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMastitisPrompt',
  input: {schema: DetectMastitisInputSchema},
  output: {schema: DetectMastitisOutputSchema},
  prompt: `You are an expert AI veterinarian specializing in livestock health. Your task is to analyze a sequence of video frames to detect behavioral signs of mastitis.

  Focus on these key visual indicators:
  1.  **Constant Lying Down (Sürekli Yatma):** The animal is lying down for an unusually long period and is reluctant to stand up.
  2.  **Limping (Topallama):** The animal shows signs of lameness or an uneven gait, which can be caused by a painful, swollen udder.
  3.  **Scratching/Kicking the Udder Area (Meme Bölgesini Kaşıma/Tekmeleme):** The animal frequently tries to scratch, lick, or kick at its udder, indicating irritation or pain.

  Analyze the provided frames. If two or more of these signs are observed within the short period represented by the frames, you must flag a "mastitis risk".

  {{#each frames}}
  Frame: {{media url=this}}
  {{/each}}
  
  Based on your analysis, provide the following:
  - **isMastitisRisk**: Set to true if two or more signs are detected, otherwise false.
  - **detectedSigns**: List the specific signs you observed (e.g., "Sürekli Yatma", "Topallama"). If no signs, return an empty array.
  - **confidence**: If risk is detected, what is your confidence level (Yüksek, Orta, Düşük)? If no risk, set to "Yok".
  - **recommendation**: If a risk is detected, provide a brief recommendation. e.g., "Mastitis riski tespit edildi. Hayvanın meme sağlığının fiziki olarak kontrol edilmesi ve veteriner hekime danışılması önerilir." If no risk, state "Belirgin bir mastitis riski saptanmadı."
`,
});

const detectMastitisFlow = ai.defineFlow(
  {
    name: 'detectMastitisFlow',
    inputSchema: DetectMastitisInputSchema,
    outputSchema: DetectMastitisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
