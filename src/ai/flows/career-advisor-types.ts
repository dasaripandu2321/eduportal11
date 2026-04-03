import { z } from 'genkit';
import { careerPaths } from '@/lib/career-paths';

const allPathSlugs = careerPaths.map(p => p.slug) as [string, ...string[]];

export const CareerAdvisorInputSchema = z.object({
  interests: z.array(z.string()).describe('A list of the user\'s selected interests.'),
  currentSkills: z.string().describe('A string where the user lists their current skills and experience.'),
  learningStyle: z.string().describe('The user\'s preferred learning style (e.g., visual, hands-on).'),
});
export type CareerAdvisorInput = z.infer<typeof CareerAdvisorInputSchema>;

export const CareerAdvisorOutputSchema = z.object({
  recommendedPathSlug: z.enum(allPathSlugs).describe('The slug of the recommended career path.'),
  justification: z.string().describe('A brief, one-sentence justification for why this path was recommended, written in an encouraging tone.'),
  skillAnalysis: z.object({
    possessed: z.array(z.string()).describe('A list of skills the user likely possesses that are relevant to the recommended path.'),
    missing: z.array(z.string()).describe('A list of skills the user likely needs to learn for the recommended path.'),
  }),
});
export type CareerAdvisorOutput = z.infer<typeof CareerAdvisorOutputSchema>;
