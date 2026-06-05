'use server';
/**
 * @fileOverview A Notes Agent that generates key note topics for a given study goal.
 *
 * - generateNotesTopics - A function that handles the generation of notes topics.
 * - NotesAgentTopicGenerationInput - The input type for the generateNotesTopics function.
 * - NotesAgentTopicGenerationOutput - The return type for the generateNotesTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NotesAgentTopicGenerationInputSchema = z.object({
  studyGoal: z.string().describe('The user\'s study goal, e.g., "Learn about the history of the Roman Empire."'),
});
export type NotesAgentTopicGenerationInput = z.infer<typeof NotesAgentTopicGenerationInputSchema>;

const NotesAgentTopicGenerationOutputSchema = z.object({
  notesTopics: z.array(z.string()).describe('An array of key note topics relevant to the study goal.'),
});
export type NotesAgentTopicGenerationOutput = z.infer<typeof NotesAgentTopicGenerationOutputSchema>;

const notesAgentTopicGenerationPrompt = ai.definePrompt({
  name: 'notesAgentTopicGenerationPrompt',
  input: {schema: NotesAgentTopicGenerationInputSchema},
  output: {schema: NotesAgentTopicGenerationOutputSchema},
  prompt: `As an expert educator, your task is to identify and list key note topics that a student should focus on to achieve their study goal.
The goal is to provide a structured list of critical information points.

Study Goal: "{{{studyGoal}}}"

Based on the study goal, generate a comprehensive list of key note topics.
Respond with a JSON object containing a 'notesTopics' array of strings, where each string is a distinct note topic.`,
});

const notesAgentTopicGenerationFlow = ai.defineFlow(
  {
    name: 'notesAgentTopicGenerationFlow',
    inputSchema: NotesAgentTopicGenerationInputSchema,
    outputSchema: NotesAgentTopicGenerationOutputSchema,
  },
  async (input) => {
    const {output} = await notesAgentTopicGenerationPrompt(input);
    return output!;
  }
);

export async function generateNotesTopics(
  input: NotesAgentTopicGenerationInput
): Promise<NotesAgentTopicGenerationOutput> {
  return notesAgentTopicGenerationFlow(input);
}
