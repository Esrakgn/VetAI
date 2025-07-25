'use server';

/**
 * @fileOverview A flow that predicts the probable causes of an animal behavior anomaly.
 *
 * - predictAnomalyCause - A function that predicts the causes of an anomaly.
 * - PredictAnomalyCauseInput - The input type for the predictAnomalyCause function.
 * - PredictAnomalyCauseOutput - The return type for the predictAnomalyCause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictAnomalyCauseInputSchema = z.object({
  animalId: z.string().describe('The ID of the animal exhibiting the anomaly.'),
  observedBehavior: z.string().describe('A description of the unusual behavior observed.'),
  historicalData: z
    .string()
    .describe('Historical data about the animal, including past behaviors and health records.'),
});
export type PredictAnomalyCauseInput = z.infer<typeof PredictAnomalyCauseInputSchema>;

const PredictAnomalyCauseOutputSchema = z.object({
  probableCauses: z
    .array(z.string())
    .describe('A ranked list of probable causes for the observed anomaly.'),
});
export type PredictAnomalyCauseOutput = z.infer<typeof PredictAnomalyCauseOutputSchema>;

export async function predictAnomalyCause(input: PredictAnomalyCauseInput): Promise<PredictAnomalyCauseOutput> {
  return predictAnomalyCauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictAnomalyCausePrompt',
  input: {schema: PredictAnomalyCauseInputSchema},
  output: {schema: PredictAnomalyCauseOutputSchema},
  prompt: `You are an AI assistant that analyzes animal behavior and predicts probable causes for anomalies.

  Given the following information, provide a ranked list of probable causes for the observed anomaly.

  Animal ID: {{{animalId}}}
  Observed Behavior: {{{observedBehavior}}}
  Historical Data: {{{historicalData}}}

  Format your response as a ranked list of probable causes.
  `,
});

const predictAnomalyCauseFlow = ai.defineFlow(
  {
    name: 'predictAnomalyCauseFlow',
    inputSchema: PredictAnomalyCauseInputSchema,
    outputSchema: PredictAnomalyCauseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
