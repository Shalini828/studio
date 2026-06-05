'use server';
/**
 * @fileOverview A Genkit flow for the Summary Agent to generate a revision summary.
 *
 * - generateRevisionSummary - A function that handles the revision summary generation process.
 * - SummaryAgentRevisionSummaryGenerationInput - The input type for the generateRevisionSummary function.
 * - SummaryAgentRevisionSummaryGenerationOutput - The return type for the generateRevisionSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummaryAgentRevisionSummaryGenerationInputSchema = z.object({
  studyGoal: z.string().describe('The user\'s study goal.'),
});
export type SummaryAgentRevisionSummaryGenerationInput = z.infer<typeof SummaryAgentRevisionSummaryGenerationInputSchema>;

const SummaryAgentRevisionSummaryGenerationOutputSchema = z.object({
  revisionSummary: z.string().describe('A concise revision summary for the given study goal.'),
});
export type SummaryAgentRevisionSummaryGenerationOutput = z.infer<typeof SummaryAgentRevisionSummaryGenerationOutputSchema>;

export async function generateRevisionSummary(input: SummaryAgentRevisionSummaryGenerationInput): Promise<SummaryAgentRevisionSummaryGenerationOutput> {
  return summaryAgentRevisionSummaryGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summaryAgentRevisionSummaryGenerationPrompt',
  input: { schema: SummaryAgentRevisionSummaryGenerationInputSchema },
  output: { schema: SummaryAgentRevisionSummaryGenerationOutputSchema },
  prompt: `You are a helpful Summary Agent for students. Your task is to create a concise revision summary for the given study goal. Focus on key concepts and main points, making it easy for a student to quickly grasp the essential information for review.

Study Goal: {{{studyGoal}}}`,
});

const summaryAgentRevisionSummaryGenerationFlow = ai.defineFlow(
  {
    name: 'summaryAgentRevisionSummaryGenerationFlow',
    inputSchema: SummaryAgentRevisionSummaryGenerationInputSchema,
    outputSchema: SummaryAgentRevisionSummaryGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);