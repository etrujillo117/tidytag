// src/ai/flows/suggest-items.ts
'use server';
/**
 * @fileOverview A flow to suggest items that might belong in a given storage container,
 * based on the container's name and the items already present.
 *
 * - suggestItems - A function that suggests items for a container.
 * - SuggestItemsInput - The input type for the suggestItems function.
 * - SuggestItemsOutput - The return type for the suggestItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestItemsInputSchema = z.object({
  containerName: z.string().describe('The name of the storage container.'),
  existingItems: z.array(z.string()).describe('The list of items already in the container.'),
});
export type SuggestItemsInput = z.infer<typeof SuggestItemsInputSchema>;

const SuggestItemsOutputSchema = z.object({
  suggestedItems: z.array(z.string()).describe('A list of suggested items for the container.'),
});
export type SuggestItemsOutput = z.infer<typeof SuggestItemsOutputSchema>;

export async function suggestItems(input: SuggestItemsInput): Promise<SuggestItemsOutput> {
  return suggestItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestItemsPrompt',
  input: {schema: SuggestItemsInputSchema},
  output: {schema: SuggestItemsOutputSchema},
  prompt: `You are a helpful assistant that suggests items that might belong in a storage container.

  The container is named "{{containerName}}". The following items are already in the container:

  {{#if existingItems}}
  {{#each existingItems}}- {{this}}\n{{/each}}
  {{else}}
  The container is empty.
  {{/if}}

  Suggest some other items that might belong in this container.  Return at least 3 suggestions.
  Do not suggest any items that are already in the container.
  `,
});

const suggestItemsFlow = ai.defineFlow(
  {
    name: 'suggestItemsFlow',
    inputSchema: SuggestItemsInputSchema,
    outputSchema: SuggestItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
