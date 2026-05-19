import BaseCardSelector from './BaseCardSelector.js';

class SelectSelector extends BaseCardSelector {
    choices: Record<string, (context: any) => boolean>;

    constructor(properties: any) {
        super(properties);
        this.choices = properties.choices;
    }

    hasEnoughTargets(context: any): boolean {
        return Object.values(this.choices).some((condition: (context: any) => boolean) => condition(context));
    }

    defaultActivePromptTitle(): string {
        return 'Select one';
    }
}

export default SelectSelector;
