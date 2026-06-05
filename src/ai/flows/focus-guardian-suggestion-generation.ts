'use server';
/**
 * @fileOverview An AI agent that generates focus improvement suggestions based on a study goal.
 *
 * - generateFocusGuardianSuggestions - A function that handles the focus suggestion generation process.
 * - FocusGuardianSuggestionGenerationInput - The input type for the generateFocusGuardianSuggestions function.
 * - FocusGuardianSuggestionGenerationOutput - The return type for the generateFocusGuardianSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FocusGuardianSuggestionGenerationInputSchema = z.object({
  studyGoal: z.string().describe('The user\u0027s study goal.'),
});
export type FocusGuardianSuggestionGenerationInput = z.infer<typeof FocusGuardianSuggestionGenerationInputSchema>;

const FocusGuardianSuggestionGenerationOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of focus improvement suggestions.'),
});
export type FocusGuardianSuggestionGenerationOutput = z.infer<typeof FocusGuardianSuggestionGenerationOutputSchema>;

const focusGuardianSuggestionPrompt = ai.definePrompt({
  name: 'focusGuardianSuggestionPrompt',
  input: {schema: FocusGuardianSuggestionGenerationInputSchema},
  output: {schema: FocusGuardianSuggestionGenerationOutputSchema},
  prompt: `You are an AI-powered Focus Guardian Agent. Your task is to provide actionable and personalized suggestions to help a student maintain concentration and study more efficiently, based on their study goal.

Study Goal: {{{studyGoal}}}

Provide 3-5 concise, practical focus improvement suggestions. Consider aspects like environment, breaks, techniques, and mindset. Respond in a JSON format containing a single 'suggestions' array of strings.

Example Output:
{
  "suggestions": [
    "Break down your study goal into smaller, manageable chunks to avoid overwhelm.",
    "Use the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.",
    "Eliminate distractions by putting your phone on silent and closing unnecessary browser tabs."
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
