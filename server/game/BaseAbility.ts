import type { ActionOverrides, HeldAction } from './GameActions/GameAction.js';
import { AbilityTargetAbility } from './AbilityTargets/AbilityTargetAbility.js';
import { AbilityTargetCard } from './AbilityTargets/AbilityTargetCard.js';
import { AbilityTargetRing } from './AbilityTargets/AbilityTargetRing.js';
import { AbilityTargetSelect } from './AbilityTargets/AbilityTargetSelect.js';
import { AbilityTargetToken } from './AbilityTargets/AbilityTargetToken.js';
import { AbilityTargetElementSymbol } from './AbilityTargets/AbilityTargetElementSymbol.js';
import { Stage, TargetMode, AbilityType, type Players, EventName, Blocker } from './Constants.js';
import type Player from './Player.js';
import type { AbilityContext } from './AbilityContext.js';
import { GameAction } from './GameActions/GameAction.js';
import type { Event } from './Events/Event.js';
import type { Cost } from './costs/Cost.js';
import type { TargetPropertiesInput } from './Interfaces.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type BaseCard from './BaseCard.js';
import type { CardAbility } from './CardAbility.js';
import type { TriggeredAbility } from './TriggeredAbility.js';

interface AbilityTargetProperties {
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
}

/** What a target knows of the target that depends on it (of any kind): it checks it for each candidate. */
export interface DependentTarget {
    hasLegalTarget(context: AbilityContext): boolean;
    checkGameActionsForTargetsChosenByInitiatingPlayer?(context: AbilityContext): boolean;
}

/** The ability a target belongs to, as seen by the target: its sibling targets. */
export interface OwningAbility {
    targets: { name: string; dependentTarget: DependentTarget | null }[];
}

interface AbilityTarget extends DependentTarget {
    name: string;
    properties: AbilityTargetProperties;
    dependentTarget: DependentTarget | null;
    dependentCost?: Cost | null;
    canResolve(context: AbilityContext): boolean;
    resolve(context: AbilityContext, targetResults: TargetResults): void;
    checkTarget(context: AbilityContext): boolean;
    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean;
    getGameAction(context: AbilityContext): HeldAction[];
    getChoosingPlayer(context: AbilityContext): Player | undefined;
}

/**
 * A game action as ability properties declare it: typed for the ability's own context, so nested
 * property factories get that context. The ability checks that it is a `GameAction` when stored.
 */
export interface DeclaredGameAction<Context = never> {
    hasLegalTarget(context: Context, additionalProperties?: ActionOverrides): boolean;
}

export function toGameAction(action: object, message = 'An ability\'s gameAction must be a game action'): GameAction {
    if(!(action instanceof GameAction)) {
        throw new Error(message);
    }
    return action;
}

export interface BaseAbilityProperties {
    cost?: Cost | Cost[];
    target?: TargetPropertiesInput;
    targets?: Record<string, TargetPropertiesInput>;
    gameAction?: DeclaredGameAction | DeclaredGameAction[];
}

export interface TargetResults {
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityTarget | null;
    playCosts?: boolean;
    triggerCosts?: boolean;
    events?: Event[];
}

/**
 * Base class representing an ability that can be done by the player. This
 * includes card actions, reactions, interrupts, playing a card, marshaling a
 * card.
 *
 * Most of the methods take a context object. While the structure will vary from
 * inheriting classes, it is guaranteed to have at least the `game` object, the
 * `player` that is executing the action, and the `source` card object that the
 * ability is generated from.
 */
export class BaseAbility {
    abilityType: AbilityType = AbilityType.Action;
    gameAction: GameAction[];
    targets: AbilityTarget[];
    cost: Cost[];
    nonDependentTargets: AbilityTarget[];
    // set by card abilities; the engine and cards read them from any ability
    title?: string;
    limit?: AbilityLimit;
    max?: AbilityLimit;
    maxIdentifier?: string;
    cannotTargetFirst?: boolean;
    /** Both players choose, the first player first (developer rulings). */
    firstPlayerChoosesFirst?: boolean;
    cannotBeCancelled?: boolean;
    cannotBeMirrored?: boolean;
    printedAbility?: boolean;
    origin?: BaseCard;

    /**
     * Creates an ability.
     *
     * @param properties - An object with ability related properties.
     * @param properties.cost - optional property that specifies the cost for the ability.
     * @param properties.target - optional property that specifies the target of the ability.
     * @param properties.gameAction - optional array of game actions
     */
    constructor(properties: BaseAbilityProperties) {
        const gameActions = properties.gameAction ? (Array.isArray(properties.gameAction) ? properties.gameAction : [properties.gameAction]) : [];
        this.gameAction = gameActions.map((action) => toGameAction(action));
        this.targets = [];
        this.buildTargets(properties);
        this.cost = this.buildCost(properties.cost);
        for(const cost of this.cost) {
            if(cost.dependsOn) {
                const dependsOnTarget = this.targets.find((target) => target.name === cost.dependsOn);
                if(dependsOnTarget) {
                    dependsOnTarget.dependentCost = cost;
                }
            }
        }
        this.nonDependentTargets = this.targets.filter((target) => !target.properties.dependsOn);
    }

    buildCost(cost?: Cost | Cost[]): Cost[] {
        if(!cost) {
            return [];
        }

        if(!Array.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    buildTargets(properties: BaseAbilityProperties): void {
        this.targets = [];
        if(properties.target) {
            this.targets.push(this.getAbilityTarget('target', properties.target));
        } else if(properties.targets) {
            for(const key of Object.keys(properties.targets)) {
                this.targets.push(this.getAbilityTarget(key, properties.targets[key]));
            }
        }
    }

    getAbilityTarget(name: string, properties: TargetPropertiesInput): AbilityTarget {
        const gameAction = properties.gameAction
            ? (Array.isArray(properties.gameAction) ? properties.gameAction : [properties.gameAction])
            : [];
        const normalized = { ...properties, gameAction };
        if(normalized.mode === TargetMode.Select) {
            return new AbilityTargetSelect(name, normalized, this);
        } else if(normalized.mode === TargetMode.Ring) {
            return new AbilityTargetRing(name, normalized, this);
        } else if(normalized.mode === TargetMode.Ability) {
            return new AbilityTargetAbility(name, normalized, this);
        } else if(normalized.mode === TargetMode.Token) {
            return new AbilityTargetToken(name, normalized, this);
        } else if(normalized.mode === TargetMode.ElementSymbol) {
            return new AbilityTargetElementSymbol(name, normalized, this);
        }
        return new AbilityTargetCard(name, normalized, this);
    }

    meetsRequirements(context: AbilityContext, ignoredBlockers: Blocker[] = []): Blocker {
        // check legal targets exist
        // check costs can be paid
        // check for potential to change game state
        if(!this.canPayCosts(context) && !ignoredBlockers.includes(Blocker.CannotPayCost)) {
            return Blocker.CannotPayCost;
        }
        if(this.targets.length === 0) {
            if(this.gameAction.length > 0 && !this.checkGameActionsForPotential(context)) {
                return Blocker.ConditionNotMet;
            }
            return Blocker.None;
        }
        return this.canResolveTargets(context) ? Blocker.None : Blocker.NoLegalTarget;
    }

    checkGameActionsForPotential(context: AbilityContext): boolean {
        return this.gameAction.some((gameAction) => gameAction.hasLegalTarget(context));
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     */
    canPayCosts(context: AbilityContext): boolean {
        const contextCopy = context.copy({ stage: Stage.Cost });
        return this.getCosts(context).every((cost) => cost.canPay(contextCopy));
    }

    getCosts(context: AbilityContext, playCosts = true, _triggerCosts = true): Cost[] {
        let costs = this.cost.map((a) => a);
        if(context.ignoreFateCost) {
            costs = costs.filter((cost) => !cost.isPrintedFateCost);
        }

        if(!playCosts) {
            costs = costs.filter((cost) => !cost.isPlayCost);
        }

        if(this.opponentChoosesFirst(context)) {
            costs = [...costs.filter((cost) => cost.chosenByOpponent), ...costs.filter((cost) => !cost.chosenByOpponent)];
        }

        return costs;
    }

    private opponentChoosesFirst(context: AbilityContext): boolean {
        return !!this.firstPlayerChoosesFirst && !!context.player.opponent?.firstPlayer;
    }

    /** The targets in the order they're chosen: the first player's first if the ability says so. */
    private targetsInOrder(context: AbilityContext): AbilityTarget[] {
        if(!this.firstPlayerChoosesFirst) {
            return this.targets;
        }
        const firstPlayer = context.game.getFirstPlayer();
        return [
            ...this.targets.filter((target) => target.getChoosingPlayer(context) === firstPlayer),
            ...this.targets.filter((target) => target.getChoosingPlayer(context) !== firstPlayer)
        ];
    }

    resolveCosts(context: AbilityContext, results: TargetResults): void {
        for(const cost of this.getCosts(context, results.playCosts, results.triggerCosts)) {
            context.game.queueSimpleStep(() => {
                if(!results.cancelled) {
                    if(cost.addEventsToArray) {
                        cost.addEventsToArray(results.events ?? [], context, results);
                    } else {
                        if(cost.resolve) {
                            cost.resolve(context, results);
                        }
                        context.game.queueSimpleStep(() => {
                            if(!results.cancelled) {
                                const newEvents = cost.payEvent
                                    ? cost.payEvent(context)
                                    : context.game.getEvent(EventName.PayCost, {}, () => cost.pay?.(context));
                                if(Array.isArray(newEvents)) {
                                    for(const event of newEvents) {
                                        results.events?.push(event);
                                    }
                                } else {
                                    results.events?.push(newEvents);
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     */
    canResolveTargets(context: AbilityContext): boolean {
        return this.nonDependentTargets.every((target) => target.canResolve(context));
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     */
    resolveTargets(context: AbilityContext): TargetResults {
        const targetResults: TargetResults = {
            cancelled: false,
            payCostsFirst: false,
            delayTargeting: null
        };
        for(const target of this.targetsInOrder(context)) {
            context.game.queueSimpleStep(() => target.resolve(context, targetResults));
        }
        return targetResults;
    }

    resolveRemainingTargets(context: AbilityContext, nextTarget: AbilityTarget): TargetResults {
        let targets = this.targetsInOrder(context);
        const index = targets.indexOf(nextTarget);
        if(targets.slice(0, index).every((target) => target.checkTarget(context))) {
            targets = targets.slice(index);
        }
        const targetResults: TargetResults = {};
        for(const target of targets) {
            context.game.queueSimpleStep(() => target.resolve(context, targetResults));
        }
        return targetResults;
    }

    hasLegalTargets(context: AbilityContext): boolean {
        return this.nonDependentTargets.every((target) => target.hasLegalTarget(context));
    }

    checkAllTargets(context: AbilityContext): boolean {
        return this.nonDependentTargets.every((target) => target.checkTarget(context));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return (
            this.targets.some((target) => target.hasTargetsChosenByInitiatingPlayer(context)) ||
            this.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(context)) ||
            this.cost.some(
                (cost) => cost.hasTargetsChosenByInitiatingPlayer && cost.hasTargetsChosenByInitiatingPlayer(context)
            )
        );
    }

    displayMessage(_context: AbilityContext): void {}

    /** The fate cost after reductions; only play actions and events have one. */
    getReducedCost(_context: AbilityContext): number {
        return 0;
    }

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    executeHandler(_context: AbilityContext): void {}

    isCardPlayed(): boolean {
        return false;
    }

    /** Playing a character as an attachment: the card is played as an attachment, not as a character. */
    isCharacterPlayedAsAttachment(): boolean {
        return false;
    }

    isCardAbility(): boolean {
        return false;
    }

    /** A step after then()/afterwards(): part of an ability already initiated, not a new one. */
    isStep(): boolean {
        return false;
    }

    isTriggeredAbility(): boolean {
        return false;
    }

    isCardAbilityInstance(): this is CardAbility {
        return false;
    }

    isTriggeredAbilityInstance(): this is TriggeredAbility {
        return false;
    }

    isKeywordAbility(): boolean {
        return false;
    }
}

