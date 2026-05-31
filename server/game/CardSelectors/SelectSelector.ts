import type { AbilityContext } from '../AbilityContext.js';
import BaseCardSelector, { type BaseCardSelectorProperties } from './BaseCardSelector.js';

type SelectChoices = Record<string, (context: AbilityContext) => boolean>;

interface SelectSelectorProperties extends BaseCardSelectorProperties {
    choices: SelectChoices;
}

class SelectSelector extends BaseCardSelector {
    choices: SelectChoices;

    constructor(properties: SelectSelectorProperties) {
        super(properties);
        this.choices = properties.choices;
    }

    hasEnoughTargets(context: AbilityContext): boolean {
        return Object.values(this.choices).some((condition: (context: AbilityContext) => boolean) => condition(context));
    }

    defaultActivePromptTitle(): string {
        return 'Select one';
    }
}

export default SelectSelector;
