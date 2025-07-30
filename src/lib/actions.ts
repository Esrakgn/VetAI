'use server';

import { z } from 'zod';
import { analyzeBehavior } from '@/ai/flows/analyze-behavior';
import { predictAnomalyCause } from '@/ai/flows/predict-anomaly-cause';
import { diagnoseDisease } from '@/ai/flows/diagnose-disease';
import { generateAdvice } from '@/ai/flows/generate-advice';
import { detectBirth } from '@/ai/flows/detect-birth';
import { detectMastitis } from '@/ai/flows/detect-mastitis';
import { analyzeNewbornBehavior, AnalyzeNewbornBehaviorOutput } from '@/ai/flows/analyze-newborn-behavior';


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

// Schema for diagnoseDisease form
const DiagnoseSchema = z.object({
    photoDataUri: z.string().min(1, 'Fotoğraf gerekli.'),
    description: z.string().min(10, 'Semptom açıklaması çok kısa.'),
});

type DiagnoseState = {
    isDisease: boolean | null;
    disease: string | null;
    confidence: string | null;
    recommendation: string | null;
    error: string | null;
}

export async function handleDiagnoseDisease(prevState: DiagnoseState, formData: FormData): Promise<DiagnoseState> {
    const validatedFields = DiagnoseSchema.safeParse({
        photoDataUri: formData.get('photoDataUri'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            isDisease: null,
            disease: null,
            confidence: null,
            recommendation: null,
            error: validatedFields.error.flatten().fieldErrors.photoDataUri?.[0] || validatedFields.error.flatten().fieldErrors.description?.[0] || 'Geçersiz girdi.',
        };
    }

    try {
        const result = await diagnoseDisease(validatedFields.data);
        return {
            ...result,
            error: null,
        };
    } catch (e: any) {
        return {
            isDisease: null,
            disease: null,
            confidence: null,
            recommendation: null,
            error: e.message || 'Teşhis sırasında bilinmeyen bir hata oluştu.',
        };
    }
}

// Schema for generateAdvice form
const AdviceSchema = z.object({
    question: z.string().min(1, 'Soru boş olamaz.'),
    chatHistory: z.string(), // JSON string
});

type AdviceState = {
    response: string | null;
    error: string | null;
}

export async function handleGenerateAdvice(prevState: AdviceState, formData: FormData): Promise<AdviceState> {
     const validatedFields = AdviceSchema.safeParse({
        question: formData.get('question'),
        chatHistory: formData.get('chatHistory'),
    });

    if (!validatedFields.success) {
        return {
            response: null,
            error: validatedFields.error.flatten().fieldErrors.question?.[0] || 'Geçersiz girdi.',
        };
    }
    
    try {
        const chatHistory = JSON.parse(validatedFields.data.chatHistory);
        const result = await generateAdvice({ 
            question: validatedFields.data.question,
            chatHistory: chatHistory 
        });
        return {
            response: result.response,
            error: null,
        };
    } catch (e: any) {
        return {
            response: null,
            error: e.message || 'Tavsiye oluşturulurken bilinmeyen bir hata oluştu.',
        };
    }
}


// Schema for detectBirth form
const BirthSchema = z.object({
  frames: z.array(z.string()).min(1, 'At least one video frame is required.'),
  feedId: z.string(),
});

type BirthState = {
  isBirthDetected: boolean | null;
  estimatedBirthTime: string | null;
  keyFrame: string | null;
  evidence: string | null;
  error: string | null;
};

export async function handleDetectBirth(prevState: BirthState, formData: FormData): Promise<BirthState> {
  const frameEntries = formData.getAll('frames') as string[];

  const validatedFields = BirthSchema.safeParse({
    frames: frameEntries,
    feedId: formData.get('feedId'),
  });

  if (!validatedFields.success) {
    return {
      isBirthDetected: null,
      estimatedBirthTime: null,
      keyFrame: null,
      evidence: null,
      error: validatedFields.error.flatten().fieldErrors.frames?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await detectBirth(validatedFields.data);
    return {
      ...result,
      error: null,
    };
  } catch (e: any) {
    return {
      isBirthDetected: null,
      estimatedBirthTime: null,
      keyFrame: null,
      evidence: null,
      error: e.message || 'An unknown error occurred during birth detection.',
    };
  }
}

// Schema for detectMastitis form
const MastitisSchema = z.object({
  frames: z.array(z.string()).min(1, 'At least one video frame is required.'),
  feedId: z.string(),
});

type MastitisState = {
    isMastitisRisk: boolean | null;
    detectedSigns: string[] | null;
    confidence: string | null;
    recommendation: string | null;
    error: string | null;
};

export async function handleDetectMastitis(prevState: MastitisState, formData: FormData): Promise<MastitisState> {
  const frameEntries = formData.getAll('frames') as string[];

  const validatedFields = MastitisSchema.safeParse({
    frames: frameEntries,
    feedId: formData.get('feedId'),
  });

  if (!validatedFields.success) {
    return {
        isMastitisRisk: null,
        detectedSigns: null,
        confidence: null,
        recommendation: null,
        error: validatedFields.error.flatten().fieldErrors.frames?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await detectMastitis(validatedFields.data);
    if(result.isMastitisRisk) {
        // Here you could potentially trigger another action, like creating an alert
    }
    return {
      ...result,
      error: null,
    };
  } catch (e: any) {
    return {
        isMastitisRisk: null,
        detectedSigns: null,
        confidence: null,
        recommendation: null,
        error: e.message || 'An unknown error occurred during mastitis detection.',
    };
  }
}

// Schema for analyzeNewbornBehavior form
const NewbornSchema = z.object({
  frames: z.array(z.string()).min(1, 'At least one video frame is required.'),
});

type NewbornState = AnalyzeNewbornBehaviorOutput & { error: string | null };

export async function handleAnalyzeNewborn(prevState: NewbornState, formData: FormData): Promise<NewbornState> {
  const frameEntries = formData.getAll('frames') as string[];

  const validatedFields = NewbornSchema.safeParse({
    frames: frameEntries,
  });

  if (!validatedFields.success) {
    return {
      sucklingBehavior: 'Hayır',
      activityLevel: 'Yok',
      riskScore: 0,
      summary: '',
      error: validatedFields.error.flatten().fieldErrors.frames?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await analyzeNewbornBehavior(validatedFields.data);
    return {
      ...result,
      error: null,
    };
  } catch (e: any) {
    return {
      sucklingBehavior: 'Hayır',
      activityLevel: 'Yok',
      riskScore: 0,
      summary: '',
      error: e.message || 'An unknown error occurred during newborn behavior analysis.',
    };
  }
}
