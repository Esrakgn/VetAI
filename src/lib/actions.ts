'use server';

import { z } from 'zod';
import { analyzeBehavior } from '@/ai/flows/analyze-behavior';
import { predictAnomalyCause } from '@/ai/flows/predict-anomaly-cause';

// Schema for analyzeBehavior form
const AnalyzeSchema = z.object({
  videoDataUri: z.string().min(1, 'Video file is required.'),
  behaviorDescription: z.string().min(10, 'Behavior description is too short.'),
  feedId: z.string(),
});

type AnalyzeState = {
  anomalies: string[] | null;
  causePrediction: string | null;
  error: string | null;
};

export async function handleAnalyzeBehavior(prevState: AnalyzeState, formData: FormData): Promise<AnalyzeState> {
  const validatedFields = AnalyzeSchema.safeParse({
    videoDataUri: formData.get('videoDataUri'),
    behaviorDescription: formData.get('behaviorDescription'),
    feedId: formData.get('feedId'),
  });

  if (!validatedFields.success) {
    return {
      anomalies: null,
      causePrediction: null,
      error: validatedFields.error.flatten().fieldErrors.videoDataUri?.[0] || validatedFields.error.flatten().fieldErrors.behaviorDescription?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await analyzeBehavior(validatedFields.data);
    return {
      anomalies: result.anomalies,
      causePrediction: result.causePrediction,
      error: null,
    };
  } catch (e: any) {
    return {
      anomalies: null,
      causePrediction: null,
      error: e.message || 'An unknown error occurred during analysis.',
    };
  }
}


// Schema for predictAnomalyCause form
const PredictSchema = z.object({
    animalId: z.string().min(1, 'Animal ID is required.'),
    observedBehavior: z.string().min(10, 'Observed behavior description is too short.'),
    historicalData: z.string().optional(),
});

type PredictState = {
    probableCauses: string[] | null;
    error: string | null;
}

export async function handlePredictCause(prevState: PredictState, formData: FormData): Promise<PredictState> {
    const validatedFields = PredictSchema.safeParse({
        animalId: formData.get('animalId'),
        observedBehavior: formData.get('observedBehavior'),
        historicalData: formData.get('historicalData'),
    });

    if (!validatedFields.success) {
        return {
            probableCauses: null,
            error: validatedFields.error.flatten().fieldErrors.animalId?.[0] || validatedFields.error.flatten().fieldErrors.observedBehavior?.[0] || 'Invalid input.',
        };
    }

    try {
        const result = await predictAnomalyCause({
          ...validatedFields.data,
          // Provide a default empty string if historicalData is undefined
          historicalData: validatedFields.data.historicalData || '', 
        });
        return {
            probableCauses: result.probableCauses,
            error: null,
        };
    } catch (e: any) {
        return {
            probableCauses: null,
            error: e.message || 'An unknown error occurred during prediction.',
        };
    }
}
