'use server';
/**
 * @fileOverview An AI agent that generates focus improvement suggestions and a focus score based on a study goal.
 *
 * - generateFocusGuardianSuggestions - A function that handles the focus suggestion generation process.
 * - FocusGuardianSuggestionGenerationInput - The input type for the generateFocusGuardianSuggestions function.
 * - FocusGuardianSuggestionGenerationOutput - The return type for the generateFocusGuardianSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FocusGuardianSuggestionGenerationInputSchema = z.object({
  studyGoal: z.string().describe('The user\'s study goal.'),
});
export type FocusGuardianSuggestionGenerationInput = z.infer<typeof FocusGuardianSuggestionGenerationInputSchema>;

const FocusGuardianSuggestionGenerationOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of focus improvement suggestions.'),
  focusScore: z.number().min(0).max(100).describe('A generated focus score between 0 and 100 based on task complexity.'),
  distractionWarnings: z.array(z.string()).describe('Warnings about potential distractions related to this goal.'),
});
export type FocusGuardianSuggestionGenerationOutput = z.infer<typeof FocusGuardianSuggestionGenerationOutputSchema>;

const focusGuardianSuggestionPrompt = ai.definePrompt({
  name: 'focusGuardianSuggestionPrompt',
  input: {schema: FocusGuardianSuggestionGenerationInputSchema},
  output: {schema: FocusGuardianSuggestionGenerationOutputSchema},
  prompt: `You are an AI-powered Focus Guardian Agent. Your task is to provide actionable suggestions, a focus score, and distraction warnings to help a student maintain concentration for their study goal.

Study Goal: {{{studyGoal}}}

Provide:
1. 3-5 concise, practical focus improvement suggestions.
2. A focus score (0-100) representing the estimated cognitive demand and focus difficulty of this goal.
3. 2-3 specific distraction warnings relevant to this study topic.

Respond in a JSON format.

Example Output:
{
  "suggestions": [
    "Break down your study goal into smaller chunks.",
    "Use the Pomodoro Technique: 25 mins study, 5 mins break."
  ],
  "focusScore": 75,
  "distractionWarnings": [
    "Social media rabbit holes are common when researching this topic.",
    "Complex terminology might lead to frustration; take deep breaths."
  ]
}`,
});

const focusGuardianSuggestionGenerationFlow = ai.defineFlow(
  {
    name: 'focusGuardianSuggestionGenerationFlow',
    inputSchema: FocusGuardianSuggestionGenerationInputSchema,
    outputSchema: FocusGuardianSuggestionGenerationOutputSchema,
  },
  async input => {
    const {output} = await focusGuardianSuggestionPrompt(input);
    return output!;
  }
);

export async function generateFocusGuardianSuggestions(input: FocusGuardianSuggestionGenerationInput): Promise<FocusGuardianSuggestionGenerationOutput> {
  return focusGuardianSuggestionGenerationFlow(input);
}
