'use server';
/**
 * @fileOverview A Genkit flow that generates a list of research resources based on a study goal.
 *
 * - researchAgentResourceGeneration - A function that initiates the resource generation process.
 * - ResearchAgentResourceGenerationInput - The input type for the researchAgentResourceGeneration function.
 * - ResearchAgentResourceGenerationOutput - The return type for the researchAgentResourceGeneration function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResearchAgentResourceGenerationInputSchema = z.object({
  studyGoal: z.string().describe('The study goal provided by the student.'),
});
export type ResearchAgentResourceGenerationInput = z.infer<typeof ResearchAgentResourceGenerationInputSchema>;

const ResearchAgentResourceGenerationOutputSchema = z.object({
  researchResources: z.array(
    z.object({
      title: z.string().describe('The title of the research resource.'),
      url: z.string().url().describe('The URL of the research resource.'),
      description: z.string().describe('A brief description of the research resource.'),
    })
  ).describe('A list of relevant research resources.'),
});
export type ResearchAgentResourceGenerationOutput = z.infer<typeof ResearchAgentResourceGenerationOutputSchema>;

export async function researchAgentResourceGeneration(input: ResearchAgentResourceGenerationInput): Promise<ResearchAgentResourceGenerationOutput> {
  return researchAgentResourceGenerationFlow(input);
}

const researchAgentResourceGenerationPrompt = ai.definePrompt({
  name: 'researchAgentResourceGenerationPrompt',
  input: { schema: ResearchAgentResourceGenerationInputSchema },
  output: { schema: ResearchAgentResourceGenerationOutputSchema },
  prompt: `You are an expert research agent. Your task is to generate a list of highly relevant and reliable research resources for a student's study goal.

Provide at least 5 to 7 resources. Each resource should have a title, a valid URL, and a brief description explaining its relevance.

Study Goal: {{{studyGoal}}}`,
});

const researchAgentResourceGenerationFlow = ai.defineFlow(
  {
    name: 'researchAgentResourceGenerationFlow',
    inputSchema: ResearchAgentResourceGenerationInputSchema,
    outputSchema: ResearchAgentResourceGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await researchAgentResourceGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate research resources.');
    }
    return output;
  }
);
