

// import { closingAgent } from './closer';
import { closerAgent } from './closer';
import { greeterAgent } from './greeter';
import { questionReaderAgent } from './questionReader';
import { stepTutorAgent } from './stepTutor';

export const aiTutoringScenario = [
    greeterAgent,
    questionReaderAgent,
    stepTutorAgent,
    closerAgent
];

// Name of the company represented by this agent set. Used by guardrails
export const aiTutoringName = 'Knova AI Tutor';
