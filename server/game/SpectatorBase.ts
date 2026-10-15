import type { PromptButton } from './PlayerPromptState.js';

/** What a spectator, signed in or anonymous, shows the game state serializer. */
export abstract class SpectatorBase {
    abstract name: string;
    abstract emailHash: string;
    buttons: PromptButton[] = [];
    menuTitle = 'Spectator mode';

    getCardSelectionState() {
        return {};
    }

    getRingSelectionState() {
        return {};
    }
}
