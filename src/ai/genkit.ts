import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Get API key from environment variables
// Next.js automatically loads .env files
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.error('ERROR: Google AI API key is required. Please set GEMINI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY in your .env file');
  throw new Error('Google AI API key is required. Please set GEMINI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY in your .env file');
}

// Initialize the Google AI plugin with explicit configuration
// Always pass apiKey as a string (not false) to avoid initialization issues
const pluginOptions = {
  apiVersion: 'v1' as const,
  apiKey: apiKey,
};

const googleAIPlugin = googleAI(pluginOptions);

// Export the genkit AI instance
export const ai = genkit({
  plugins: [googleAIPlugin],
  model: 'googleai/gemini-2.5-flash',
});
