'use server';

import { z } from 'zod';
import { analyzeBehavior } from '@/ai/flows/analyze-behavior';
import { predictAnomalyCause } from '@/ai/flows/predict-anomaly-cause';

// Schema for analyzeBehavior form
const AnalyzeSchema = z.object({
  frames: z.array(z.string()).min(1, 'At least one video frame is required.'),
  behaviorDescription: z.string().min(10, 'Behavior description is too short.'),
  feedId: z.string(),
});

type AnalyzeState = {
  anomalies: string[] | null;
  causePrediction: string | null;
  error: string | null;
};

export async function handleAnalyzeBehavior(prevState: AnalyzeState, formData: FormData): Promise<AnalyzeState> {
  const frameEntries = formData.getAll('frames') as string[];

  const validatedFields = AnalyzeSchema.safeParse({
    frames: frameEntries,
    behaviorDescription: formData.get('behaviorDescription'),
    feedId: formData.get('feedId'),
  });

  if (!validatedFields.success) {
    return {
      anomalies: null,
      causePrediction: null,
      error: validatedFields.error.flatten().fieldErrors.frames?.[0] || validatedFields.error.flatten().fieldErrors.behaviorDescription?.[0] || 'Invalid input.',
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
    animalId: z.string().min(1, 'Hayvan ID\'si gerekli.'),
    observedBehavior: z.string().min(10, 'Gözlenen davranış açıklaması çok kısa.'),
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
            error: validatedFields.error.flatten().fieldErrors.animalId?.[0] || validatedFields.error.flatten().fieldErrors.observedBehavior?.[0] || 'Geçersiz girdi.',
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
            error: e.message || 'Tahmin sırasında bilinmeyen bir hata oluştu.',
        };
    }
}
