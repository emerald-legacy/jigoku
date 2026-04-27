declare function integration(definitions: () => void): void;

declare namespace jasmine {
    interface Matchers<T> {
        toHavePrompt(text: string): boolean;
        toHavePromptButton(text: string): boolean;
        toBeAbleToSelect(card: unknown): boolean;
        toBeAbleToSelectRing(ring: unknown): boolean;
    }
}
