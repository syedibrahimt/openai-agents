import { RealtimeAgent, tool } from '@openai/agents/realtime';
import problemData from './problemData';
import { closerAgent } from './closer';

const updateNotesTool = tool({
    name: 'updateNotes',
    description: 'Updates the tutoring notes when a step is completed',
    parameters: {
        type: 'object',
        properties: {
            stepNumber: {
                type: 'number',
                description: 'The step number that was completed'
            },
            description: {
                type: 'string',
                description: 'Description of what was accomplished in this step'
            },
            updatedExpression: {
                type: 'string',
                description: 'The updated mathematical expression after this step'
            }
        },
        required: ['stepNumber', 'description', 'updatedExpression'],
        additionalProperties: false
    },
    execute: async (input, details) => {
        const { stepNumber, description, updatedExpression } = input as {
            stepNumber: number;
            description: string;
            updatedExpression: string;
        };
        
        // Get the addNote function from context
        const addNote = (details?.context as any)?.addNote as
            | ((stepNumber: number, description: string, updatedExpression: string) => void)
            | undefined;

        // Get the addTranscriptBreadcrumb function for logging
        const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
            | ((title: string, data?: any) => void)
            | undefined;
        
        // Add the note using the context function
        if (addNote) {
            addNote(stepNumber, description, updatedExpression);
        }
        
        // Also add a breadcrumb for tracking in the transcript
        if (addBreadcrumb) {
            addBreadcrumb(`[stepTutor] Step ${stepNumber} completed`, {
                stepNumber,
                description,
                updatedExpression
            });
        }
        
        return { success: true, message: `Notes updated for step ${stepNumber}` };
    }
});

export const stepTutorAgent = new RealtimeAgent({
    name: 'stepTutor',
    voice: 'sage',
    handoffDescription:
        'The agent that guides the student through the problem-solving process step by step.',
    instructions: `You will guide the student through the problem-solving process for the following problem: ${problemData.problem}.

Follow these steps:
- For each step in the steps array, ask ALL conceptual questions from that step sequentially.
- For step ${problemData.steps[0].step}: ${problemData.steps[0].conceptual_questions.map(q => q.question).join(' Then ask: ')}
- For step ${problemData.steps[1].step}: ${problemData.steps[1].conceptual_questions.map(q => q.question).join(' Then ask: ')}
- For step ${problemData.steps[2].step}: ${problemData.steps[2].conceptual_questions.map(q => q.question).join(' Then ask: ')}
- For step ${problemData.steps[3].step}: ${problemData.steps[3].conceptual_questions.map(q => q.question).join(' Then ask: ')}

Process:
1. Ask all conceptual questions for a step, one at a time
2. Wait for the student's answer after each question
3. If the answer is correct, acknowledge and continue to the next question in the step
4. If the answer is incorrect, gently correct the student and continue
5. After completing all questions in a step, automatically and silently call the updateNotes tool (do NOT announce this to the student)
6. Move to the next step and repeat
7. Track if students answer questions from future steps and adjust accordingly

IMPORTANT: When a step is completed, automatically and silently call the updateNotes tool with:
- stepNumber: the completed step number
- description: "${problemData.steps[0].notes.description}" for step 1, "${problemData.steps[1].notes.description}" for step 2, etc.
- updatedExpression: "${problemData.steps[0].notes.updated_expression}" for step 1, "${problemData.steps[1].notes.updated_expression}" for step 2, etc.

DO NOT mention updating notes, taking notes, or any reference to the updateNotes tool in your conversation with the student. This should happen seamlessly in the background without any verbal announcement.

At the end, summarize the solution and the session will automatically conclude with final congratulations.`,
    handoffs: [closerAgent],
    tools: [updateNotesTool]
});