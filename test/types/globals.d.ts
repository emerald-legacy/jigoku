/* eslint-disable @typescript-eslint/no-unused-vars */
import type { fillers as deckFillers } from '../helpers/deckbuilder.js';

export {};

declare global {
    var integration: (definitions: () => void) => void;
    var fillers: typeof deckFillers;

    namespace jasmine {
        interface Matchers<T> {
            toHavePrompt(text: string): boolean;
            toHavePromptButton(text: string): boolean;
            toHaveDisabledPromptButton(text: string): boolean;
            toBeAbleToSelect(card: unknown): boolean;
            toBeAbleToSelectRing(ring: unknown): boolean;
        }
    }
}
