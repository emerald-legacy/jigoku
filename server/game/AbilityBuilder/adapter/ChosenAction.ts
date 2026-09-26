import type { AbilityContext } from '../../AbilityContext.js';
import type { Event } from '../../Events/Event.js';
import { GameAction } from '../../GameActions/GameAction.js';
import type { MessageArgs } from '../../GameChat.js';
import type { GameObject } from '../../GameObject.js';

/**
 * The inner action of an old "select" action. The select action gives the chosen game object as
 * the target, and this action builds the effect for that object.
 */
export class ChosenAction<T> extends GameAction {
    name = 'builderChosen';

    constructor(private readonly build: (chosen: T) => undefined | GameAction) {
        super({});
    }

    private built(context: AbilityContext, additionalProperties = {}): undefined | GameAction {
        const [chosen] = this.getProperties(context, additionalProperties).target as T[];
        return chosen === undefined ? undefined : this.build(chosen);
    }

    setDefaultTarget(): void {}

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        return this.built(context, additionalProperties)?.hasLegalTarget(context) ?? false;
    }

    canAffect(target: GameObject, context: AbilityContext): boolean {
        return this.build(target as T)?.hasLegalTarget(context) ?? false;
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        this.built(context, additionalProperties)?.addEventsToArray(events, context);
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        return this.built(context)?.getEffectMessage(context) ?? ['', []];
    }
}
