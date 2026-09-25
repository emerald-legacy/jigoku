import type { AbilityContext } from '../../AbilityContext.js';
import type { Event } from '../../Events/Event.js';
import { GameAction } from '../../GameActions/GameAction.js';
import type { MessageArgs } from '../../GameChat.js';
import type { GameObject } from '../../GameObject.js';

/**
 * One old-style game action that runs the effects callback of a builder step.
 *
 * The callback runs again for each call, with the context of that call. This keeps the
 * effects correct for legality checks (context copies), copies and re-resolutions.
 */
export class EffectsAction extends GameAction {
    name = 'builderEffects';

    constructor(
        private readonly build: (context: AbilityContext) => readonly GameAction[],
        /** An extra legality check, for example that each chosen card can be affected. */
        private readonly check: (context: AbilityContext, actions: readonly GameAction[]) => boolean = () => true
    ) {
        super({});
    }

    actions(context: AbilityContext): readonly GameAction[] {
        return this.build(context);
    }

    legalActions(context: AbilityContext, additionalProperties = {}): GameAction[] {
        return this.actions(context).filter((action) => action.hasLegalTarget(context, additionalProperties));
    }

    // The effects set their own targets, so the default target of the owning target is ignored.
    setDefaultTarget(): void {}

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        const actions = this.actions(context);
        return (
            actions.some((action) => action.hasLegalTarget(context, additionalProperties)) &&
            this.check(context, actions)
        );
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        return this.actions(context).some((action) => action.canAffect(target, context, additionalProperties));
    }

    allTargetsLegal(context: AbilityContext, additionalProperties = {}): boolean {
        return this.hasLegalTarget(context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        for(const action of this.legalActions(context, additionalProperties)) {
            action.addEventsToArray(events, context, additionalProperties);
        }
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        const [first] = this.legalActions(context);
        return first ? first.getEffectMessage(context) : ['', []];
    }

    getCostMessage(): undefined | MessageArgs {
        return undefined;
    }

    isOptional(): boolean {
        return false;
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.actions(context).some((action) => action.hasTargetsChosenByInitiatingPlayer(context));
    }
}
