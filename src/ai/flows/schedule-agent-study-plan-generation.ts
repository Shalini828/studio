'use server';
/**
 * @fileOverview A Genkit flow for generating a 7-day study plan based on a user's study goal.
 *
 * - generateStudyPlan - A function that generates a 7-day study plan.
 * - ScheduleAgentStudyPlanGenerationInput - The input type for the generateStudyPlan function.
 * - ScheduleAgentStudyPlanGenerationOutput - The return type for the generateStudyPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScheduleAgentStudyPlanGenerationInputSchema = z.object({
  studyGoal: z.string().describe('The user\'s study goal, e.g., "Master calculus for my upcoming exam."'),
});

export type ScheduleAgentStudyPlanGenerationInput = z.infer<typeof ScheduleAgentStudyPlanGenerationInputSchema>;

const ScheduleAgentStudyPlanGenerationOutputSchema = z.array(
  z.object({
    day: z.string().describe('The day of the study plan, e.g., "Day 1", "Day 2", etc.'),
    theme: z.string().describe('A brief theme or focus for the day\'s study, e.g., "Algebra Review", "Calculus Chapter 1: Limits".'),
    activities: z.array(z.string()).describe('A list of study activities for the day, with estimated duration where applicable.'),
  })
).length(7).describe('A 7-day structured study plan tailored to the study goal.');

export type ScheduleAgentStudyPlanGenerationOutput = z.infer<typeof ScheduleAgentStudyPlanGenerationOutputSchema>;

export async function generateStudyPlan(input: ScheduleAgentStudyPlanGenerationInput): Promise<ScheduleAgentStudyPlanGenerationOutput> {
  return scheduleAgentStudyPlanGenerationFlow(input);
}

const scheduleAgentStudyPlanPrompt = ai.definePrompt({
  name: 'scheduleAgentStudyPlanPrompt',
  input: { schema: ScheduleAgentStudyPlanGenerationInputSchema },
  output: { schema: ScheduleAgentStudyPlanGenerationOutputSchema },
  prompt: `You are an expert academic planner AI. Your task is to create a comprehensive 7-day study plan for a student based on their study goal.

The study plan should be structured as an array of 7 daily entries. Each entry must include a 'day' (e.g., "Day 1"), a 'theme' summarizing the day's focus, and an array of 'activities' detailing specific tasks with estimated timeframes.

The activities should be realistic, actionable, and contribute directly to achieving the overall study goal.

Study Goal: {{{studyGoal}}}

Generate the 7-day study plan following the provided JSON schema. Ensure the output is a valid JSON array of 7 daily plans.`,
});

const scheduleAgentStudyPlanGenerationFlow = ai.defineFlow(
  {
    name: 'scheduleAgentStudyPlanGenerationFlow',
    inputSchema: ScheduleAgentStudyPlanGenerationInputSchema,
    outputSchema: ScheduleAgentStudyPlanGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await scheduleAgentStudyPlanPrompt(input);
    if (!output) {
      throw new Error('Failed to generate a study plan.');
    }
    return output;
  }
);
