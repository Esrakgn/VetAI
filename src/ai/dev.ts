import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-behavior.ts';
import '@/ai/flows/diagnose-disease.ts';
import '@/ai/flows/generate-advice.ts';
import '@/ai/flows/detect-birth.ts';
import '@/ai/flows/detect-mastitis.ts';
import '@/ai/flows/analyze-newborn-behavior.ts';
