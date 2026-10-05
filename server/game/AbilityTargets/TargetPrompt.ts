import type CardSelector from '../CardSelector.js';
import { AbilityType } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';

export type CardSelectorInstance = ReturnType<typeof CardSelector.for>;

export function waitingPromptTitle(context: AbilityContext): string {
    return context.ability.abilityType === AbilityType.Action ? 'Waiting for opponent to take an action or pass' : 'Waiting for opponent';
}
