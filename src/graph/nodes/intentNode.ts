import { AIMessage } from 'langchain';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../state.ts';
import { getSystemPrompt, type IntentData, IntentSchema } from '../../prompts/v1/identifyIntent.ts';

export function intentNode(openRouterService: OpenRouterService) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        console.log('🧠 Intent node processing...');
        try {
            const rawQuestion = state.messages.at(-1)!.text as string;
            const result = await openRouterService.generateStructured(
                getSystemPrompt(),
                rawQuestion,
                IntentSchema,
            );

            const parsedData = result.data as IntentData;
            if(!parsedData.intent || !parsedData.fileType) {
                console.log('Intent node: Missing intent or fileType in parsed data:', parsedData);
                throw new Error('Missing intent or fileType in parsed data');
            }

            parsedData.fileName ??= `data.${parsedData.fileType}`;

            console.log('Extracted intent:', parsedData.intent);
            console.log('Extracted fileType:', parsedData.fileType);
            console.log('Extracted fileName:', parsedData.fileName);

            return {
                intent: parsedData.intent,
                fileContent: parsedData.fileContent ?? "",
                fileName: parsedData.fileName,
            };

        } catch (error) {
            console.error('Intent node error:', error);
            return {
                messages: [new AIMessage('Sorry, I had trouble understanding the intent. Please rephrase your question or provide more details.')],
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}
