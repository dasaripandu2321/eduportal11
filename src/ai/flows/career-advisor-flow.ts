
'use server';

/**
 * @fileOverview An AI agent that recommends a career path and analyzes skill gaps.
 *
 * - careerAdvisor - A function that handles the career advice process.
 * - CareerAdvisorInput - The input type for the careerAdvisor function.
 * - CareerAdvisorOutput - The return type for the careerAdvisor function.
 */

import { ai } from '@/ai/genkit';
import { careerPaths } from '@/lib/career-paths';
import { 
  CareerAdvisorInputSchema, 
  CareerAdvisorOutputSchema,
  type CareerAdvisorInput,
  type CareerAdvisorOutput
} from './career-advisor-types';

const allPathSkills = [...new Set(careerPaths.flatMap(p => p.skills))];

export async function careerAdvisor(input: CareerAdvisorInput): Promise<CareerAdvisorOutput> {
  return careerAdvisorFlow(input);
}

const careerAdvisorFlow = ai.defineFlow(
  {
    name: 'careerAdvisorFlow',
    inputSchema: CareerAdvisorInputSchema,
    outputSchema: CareerAdvisorOutputSchema,
  },
  async (input) => {
    // Create a custom prompt with the data embedded
    const customPrompt = `You are an expert career advisor for people entering the tech industry.
Your goal is to recommend the best career path based on the user's interests and skills.
You will also perform a skill-gap analysis.

Analyze the user's input:
- Interests: ${JSON.stringify(input.interests)}
- Current Skills: "${input.currentSkills}"
- Learning Style: "${input.learningStyle}"

Here are the available career paths and their required skills:
${careerPaths.map(path => `- Path: ${path.name} (slug: ${path.slug})
  - Required Skills: ${JSON.stringify(path.skills)}`).join('\n')}

Based on all the information, perform the following tasks:

1. **Recommend a Career Path**: Choose the single best career path slug from the available list that aligns with the user's interests.

2. **Justify Your Recommendation**: Write a short, encouraging, one-sentence explanation for your choice. For example, "Because you enjoy building interfaces and have some design skills, Frontend Development is a great fit!"

3. **Analyze Skills**:
   - Compare the user's "Current Skills" with the "Required Skills" for your recommended path.
   - Identify which skills the user seems to have (possessed).
   - Identify which skills the user seems to be missing.
   - The available skills to choose from are: ${JSON.stringify(allPathSkills)}
   - Be realistic. If the user only mentions "Python", don't assume they also know "Pandas" and "NumPy" unless they state it.

Return the final output in the required JSON format.`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: customPrompt,
      output: { schema: CareerAdvisorOutputSchema }
    });
    
    return output!;
  }
);
