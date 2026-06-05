import { config } from 'dotenv';
config();

import '@/ai/flows/research-agent-resource-generation.ts';
import '@/ai/flows/focus-guardian-suggestion-generation.ts';
import '@/ai/flows/summary-agent-revision-summary-generation.ts';
import '@/ai/flows/schedule-agent-study-plan-generation.ts';
import '@/ai/flows/notes-agent-topic-generation.ts';