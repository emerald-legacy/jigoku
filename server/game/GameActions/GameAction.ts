import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, EventName, Stage } from '../Constants.js';
import { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';
import type { Duel } from '../Duel.js';

type GameActionTarget = Player | Ring | BaseCard | StatusToken | Duel;
type TargetValue = unknown;

export interface GameActionProperties {
    target?: GameActionTarget | GameActionTarget[];
    cannotBeCancelled?: boolean;
    optional?: boolean;
    parentAction?: GameAction<GameActionProperties>;
}

/** An event this action created: its context is the one the action was resolved with. */
export type ActionEvent<N extends EventName, C extends AbilityContext> = GameEvent<N> & { context: C };

/** `P` after `getProperties` has filled in the defaults for `K`. */
export type WithDefaults<P, K extends keyof P> = P & { [Key in K]-?: NonNullable<P[Key]> };

export class GameAction<
    P extends GameActionProperties = GameActionProperties,
    N extends EventName = EventName,
    C extends AbilityContext = AbilityContext
> {
    properties?: P;
    targetType: string[] = [];
    eventName = EventName.Unnamed;
    name = '';
    cost = '';
    effect = '';
    isNoAction?: boolean;
    defaultProperties: Partial<P> = {};
    #defaultTargetsOverride?: (context: AbilityContext) => TargetValue;
    // Method syntax keeps an action for a narrower context assignable to GameAction.
    readonly #own: { resolve(context: C): P };

    constructor(propertyFactory: P | ((context: C) => P)) {
        if(typeof propertyFactory === 'function') {
            this.#own = { resolve: propertyFactory };
        } else {
            this.properties = propertyFactory;
            this.#own = { resolve: () => propertyFactory };
        }
    }

    defaultTargets(_context: C): GameObject[] {
        return [];
    }

    getDefaultTargets(context: C): TargetValue {
        return this.#defaultTargetsOverride ? this.#defaultTargetsOverride(context) : this.defaultTargets(context);
    }

    getProperties(context: C, additionalProperties = {}): P {
        const properties = Object.assign(
            { target: this.getDefaultTargets(context), cannotBeCancelled: false, optional: false },
            this.defaultProperties,
            additionalProperties,
            this.#own.resolve(context)
        );
        const rawTarget = properties.target as TargetValue;
        const targetArray = Array.isArray(rawTarget) ? rawTarget : [rawTarget];
        properties.target = targetArray.filter(Boolean) as GameActionTarget[];
        return properties;
    }

    getCostMessage(_context: C): undefined | MessageArgs {
        return [this.cost, []];
    }

    getEffectMessage(context: C, additionalProperties = {}): MessageArgs {
        let { target } = this.getProperties(context, additionalProperties);
        return [this.effect, [target]];
    }

    setDefaultTarget(func: (context: AbilityContext) => TargetValue): void {
        this.#defaultTargetsOverride = func;
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        const { cannotBeCancelled } = this.getProperties(context, additionalProperties);
        return (
            this.targetType.includes(target.type) &&
            !context.gameActionsResolutionChain.includes(this) &&
            ((context.stage === Stage.Effect && cannotBeCancelled) || target.checkRestrictions(this.name, context))
        );
    }

    #targets(context: C, additionalProperties = {}) {
        return this.getProperties(context, additionalProperties).target as GameActionTarget[];
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        for(const candidateTarget of this.#targets(context, additionalProperties)) {
            if(this.canAffect(candidateTarget, context, additionalProperties)) {
                return true;
            }
        }
        return false;
    }

    allTargetsLegal(context: C, additionalProperties = {}): boolean {
        for(const candidateTarget of this.#targets(context, additionalProperties)) {
            if(!this.canAffect(candidateTarget, context, additionalProperties)) {
                return false;
            }
        }
        return true;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        for(const target of this.#targets(context, additionalProperties)) {
            if(this.canAffect(target, context, additionalProperties)) {
                events.push(this.getEvent(target, context, additionalProperties));
            }
        }
    }

    getEvent(target: TargetValue, context: C, additionalProperties = {}): ActionEvent<N, C> {
        const event = this.createEvent(target, context, additionalProperties);
        this.updateEvent(event, target, context, additionalProperties);
        return event;
    }

    updateEvent(event: ActionEvent<N, C>, target: TargetValue, context: C, additionalProperties = {}): void {
        event.name = this.eventName;
        this.addPropertiesToEvent(event, target, context, additionalProperties);
        event.replaceHandler((eventArg: Event) => this.eventHandler(eventArg as ActionEvent<N, C>, additionalProperties));
        event.condition = () => this.checkEventCondition(event, additionalProperties);
    }

    createEvent(target: TargetValue, context: C, additionalProperties: Record<string, unknown> = {}): ActionEvent<N, C> {
        const { cannotBeCancelled } = this.getProperties(context, additionalProperties);
        const event = new Event(EventName.Unnamed, { cannotBeCancelled, context }) as ActionEvent<N, C>;
        event.checkFullyResolved = (eventAtResolution) =>
            this.isEventFullyResolved(eventAtResolution as ActionEvent<N, C>, target, context, additionalProperties);
        return event;
    }

    resolve(
        target: undefined | GameActionTarget | GameActionTarget[],
        context: C
    ): void {
        if(target) {
            this.setDefaultTarget(() => target);
        }
        const events: Event[] = [];
        this.addEventsToArray(events, context);
        context.game.queueSimpleStep(() => context.game.openEventWindow(events));
    }

    getEventArray(context: C, additionalProperties = {}): Event[] {
        const events: Event[] = [];
        this.addEventsToArray(events, context, additionalProperties);
        return events;
    }

    addPropertiesToEvent(event: ActionEvent<N, C>, target: TargetValue, context: C, _additionalProperties = {}): void {
        event.context = context;
    }

    eventHandler(event: ActionEvent<N, C>, _additionalProperties = {}): void {}

    checkEventCondition(event: ActionEvent<N, C>, _additionalProperties = {}): boolean {
        return true;
    }

    isEventFullyResolved(event: ActionEvent<N, C>, target: TargetValue, context: C, _additionalProperties = {}): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    isOptional(context: C, additionalProperties = {}): boolean {
        return this.getProperties(context, additionalProperties).optional ?? false;
    }

    moveFateEventCondition(event: GameEvent<EventName.OnMoveFate>): boolean {
        if(event.origin) {
            if(event.origin.getFate() === 0) {
                return false;
            } else if(
                event.origin.type === CardType.Character &&
                !event.origin.allowGameAction('removeFate', (event.context))
            ) {
                return false;
            }
        }
        if(event.recipient) {
            if(
                event.recipient.type === CardType.Character &&
                !event.recipient.allowGameAction('placeFate', (event.context))
            ) {
                return false;
            }
        }
        return !!event.origin || !!event.recipient;
    }

    moveFateEventHandler(event: GameEvent<EventName.OnMoveFate>): void {
        if(event.origin) {
            event.fate = Math.min(event.fate, event.origin.getFate());
            (event.origin as DrawCard | Player).modifyFate(-event.fate);
        }
        if(event.recipient) {
            (event.recipient as DrawCard | Player).modifyFate(event.fate);
        }
    }

    hasTargetsChosenByInitiatingPlayer(context: C, _additionalProperties = {}): boolean {
        return false;
    }
}
