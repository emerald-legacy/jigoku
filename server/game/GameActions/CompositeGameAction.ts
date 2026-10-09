import type { AbilityContext } from '../AbilityContext.js';
import type { EventName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type ActionOverrides, type GameActionProperties, type WithDefaults } from './GameAction.js';

/**
 * A game action made of other game actions. They target what it targets (`getCompositeProperties`), and its
 * legality comes from the ones it would resolve now: any of them, or every one for `requiresAll`. Whatever the
 * caller overrides is passed on to each of them.
 */
export abstract class CompositeGameAction<P extends GameActionProperties = GameActionProperties, C extends AbilityContext = AbilityContext, D extends keyof P = never>
    extends GameAction<P, EventName, C, D> {
    /** Legal only if every action it would resolve is (`joint`); otherwise if any is. */
    protected requiresAll = false;

    /** The actions it holds. */
    protected abstract children(properties: WithDefaults<P, D | 'cannotBeCancelled' | 'optional'>): (GameAction | undefined)[];

    /** The actions it would resolve now; by default all it holds. */
    protected resolving(_context: C, properties: WithDefaults<P, D | 'cannotBeCancelled' | 'optional'>): GameAction[] {
        return this.children(properties).filter((action) => action !== undefined);
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        const legal = (action: GameAction) => action.hasLegalTarget(context, overrides);
        const actions = this.resolving(context, properties);
        return this.requiresAll ? actions.every(legal) : actions.some(legal);
    }

    /** Its actions may target something else than it does (a look at the hand for a chosen province), so they answer for themselves. */
    allTargetsLegal(context: C, additionalProperties: ActionOverrides = {}): boolean {
        return this.hasLegalTarget(context, additionalProperties);
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        const affects = (action: GameAction) => action.canAffect(target, context, overrides);
        const actions = this.resolving(context, properties);
        return this.requiresAll ? actions.every(affects) : actions.some(affects);
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        return this.resolving(context, properties).some((action) => action.hasTargetsChosenByInitiatingPlayer(context, overrides));
    }
}
