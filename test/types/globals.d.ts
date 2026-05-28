/* eslint-disable @typescript-eslint/no-unused-vars */
export {};

declare global {
    var integration: (definitions: () => void) => void;

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
