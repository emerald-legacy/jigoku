import type { PromptButton } from './PlayerPromptState.js';

export class AnonymousSpectator {
    name = 'Anonymous';
    emailHash = '';
    buttons: PromptButton[] = [];
    menuTitle = 'Spectator mode';

    getCardSelectionState() {
        return {};
    }

    getRingSelectionState() {
        return {};
    }
}
