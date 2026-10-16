import type { AbilityContext } from '../AbilityContext.js';
import type { EventName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type ActionOverrides, type GameActionProperties, type WithDefaults } from './GameAction.js';

/**
 * A game action made of other game actions. They target what it targets (`getCompositeProperties`), and its
 * legality comes from the ones it would resolve now: any of them, or every one for `requiresAll`. Whatever the
 * caller overrides is passed on to each of them.
 */
export abstract class CompositeGameAction<Properties extends GameActionProperties = GameActionProperties, Context extends AbilityContext = AbilityContext, Defaulted extends keyof Properties = never>
    extends GameAction<Properties, EventName, Context, Defaulted> {
    /** Legal only if every action it would resolve is (`joint`); otherwise if any is. */
    protected requiresAll = false;

    /** The actions it holds. */
    protected abstract children(properties: WithDefaults<Properties, Defaulted | 'cannotBeCancelled' | 'optional'>): (GameAction | undefined)[];

    /** The actions it would resolve now; by default all it holds. */
    protected resolving(_context: Context, properties: WithDefaults<Properties, Defaulted | 'cannotBeCancelled' | 'optional'>): GameAction[] {
        return this.children(properties).filter((action) => action !== undefined);
    }

    override hasLegalTarget(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        const legal = (action: GameAction) => action.hasLegalTarget(context, overrides);
        const actions = this.resolving(context, properties);
        return this.requiresAll ? actions.every(legal) : actions.some(legal);
    }

    /** Its actions may target something else than it does (a look at the hand for a chosen province), so they answer for themselves. */
    override allTargetsLegal(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        return this.hasLegalTarget(context, additionalProperties);
    }

    override canAffect(target: GameObject, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        const affects = (action: GameAction) => action.canAffect(target, context, overrides);
        const actions = this.resolving(context, properties);
        return this.requiresAll ? actions.every(affects) : actions.some(affects);
    }

    override hasTargetsChosenByInitiatingPlayer(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        return this.resolving(context, properties).some((action) => action.hasTargetsChosenByInitiatingPlayer(context, overrides));
    }
}
