import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Stage } from '../Constants.js';
import { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';
import type { Duel } from '../Duel.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export type GameActionTarget = Player | Ring | BaseCard | StatusToken | Duel;
type TargetValue = unknown;

export interface GameActionProperties {
    target?: GameActionTarget | GameActionTarget[];
    cannotBeCancelled?: boolean;
    optional?: boolean;
    parentAction?: GameAction<GameActionProperties>;
}

/** An event this action created: its context is the one the action was resolved with. */
export type ActionEvent<N extends EventName, C extends AbilityContext> = GameEvent<N> & { context: C };

/** A `target` property as a list: `getProperties` has already made it one, but its type still allows a single target. */
export function targetList<T>(target: T | T[] | undefined): T[] {
    return Array.isArray(target) ? target : target ? [target] : [];
}

export type Defaults<P, D extends keyof P> = { [Key in D]-?: NonNullable<P[Key]> };

export type WithDefaults<P, D extends keyof P> = P & Defaults<P, D>;

/** Sets each key of `defaults` that `properties` leaves missing or `undefined`. */
function fillDefaults<T extends object>(properties: Partial<T>, defaults: Partial<T>): void {
    for(const key in defaults) {
        const value = defaults[key];
        if(properties[key] === undefined && value !== undefined) {
            properties[key] = value;
        }
    }
}

const baseDefaults = { cannotBeCancelled: false, optional: false };

/** `D` names the properties `defaultProperties` supplies, which `getProperties` returns as non-optional. */
export class GameAction<
    P extends GameActionProperties = GameActionProperties,
    N extends EventName = EventName,
    C extends AbilityContext = AbilityContext,
    D extends keyof P = never
> {
    properties?: P;
    targetType: string[] = [];
    eventName = EventName.Unnamed;
    name = '';
    cost = '';
    effect = '';
    isNoAction?: boolean;
    defaultProperties?: Partial<P> & Defaults<P, D>;
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

    getProperties(context: C, additionalProperties = {}): WithDefaults<P, D | 'cannotBeCancelled' | 'optional'> {
        const defaults = this.defaultProperties;
        const properties = Object.assign(
            { target: this.getDefaultTargets(context) },
            baseDefaults,
            defaults,
            additionalProperties,
            this.#own.resolve(context)
        );
        fillDefaults<GameActionProperties>(properties, baseDefaults);
        if(defaults) {
            fillDefaults<P>(properties, defaults);
        }
        const rawTarget: GameActionTarget | GameActionTarget[] | undefined = properties.target;
        const targets = (Array.isArray(rawTarget) ? rawTarget : [rawTarget]).filter((target) => !!target);
        return Object.assign(properties, { target: targets });
    }

    getCostMessage(_context: C): undefined | MessageArgs {
        return [this.cost, []];
    }

    /** The effect message with `effectMessageTarget` as `{0}`, in front of `effectMessage`'s arguments. */
    getEffectMessage(context: C, additionalProperties = {}): MessageArgs {
        const [format, args] = this.effectMessage(context, additionalProperties);
        return [format, [this.effectMessageTarget(context, additionalProperties), ...args]];
    }

    /** The effect message, with its arguments from `{1}` on. */
    protected effectMessage(_context: C, _additionalProperties = {}): MessageArgs {
        return [this.effect, []];
    }

    /** `{0}` of the effect message: `undefined` for a message without one. */
    protected effectMessageTarget(context: C, additionalProperties = {}): MsgArg {
        return this.getProperties(context, additionalProperties).target;
    }

    setDefaultTarget(func: (context: AbilityContext) => TargetValue): void {
        this.#defaultTargetsOverride = func;
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        const { cannotBeCancelled } = this.getProperties(context, additionalProperties);
        return (
            this.targetType.includes(target.type) &&
            !context.gameActionsResolutionChain.some((action) => action === this) &&
            ((context.stage === Stage.Effect && cannotBeCancelled) || target.checkRestrictions(this.name, context))
        );
    }

    #targets(context: C, additionalProperties = {}): GameActionTarget[] {
        return targetList(this.getProperties(context, additionalProperties).target);
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
        event.replaceHandler(() => this.eventHandler(event, additionalProperties));
        event.condition = () => this.checkEventCondition(event, additionalProperties);
    }

    createEvent(target: TargetValue, context: C, additionalProperties: Record<string, unknown> = {}): ActionEvent<N, C> {
        const { cannotBeCancelled } = this.getProperties(context, additionalProperties);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- filled in by addPropertiesToEvent; checkEventCondition cancels a wrong kind
        const event = new Event(EventName.Unnamed, { cannotBeCancelled, context }) as ActionEvent<N, C>;
        event.checkFullyResolved = (eventAtResolution) =>
            this.isEventFullyResolved(eventAtResolution, target, context, additionalProperties);
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

    addPropertiesToEvent(event: ActionEvent<N, C>, _target: TargetValue, context: C, _additionalProperties = {}): void {
        event.context = context;
    }

    eventHandler(_event: ActionEvent<N, C>, _additionalProperties = {}): void {}

    checkEventCondition(_event: ActionEvent<N, C>, _additionalProperties = {}): boolean {
        return true;
    }

    /** `event` is the event that finally resolved, which a replacement effect may have swapped for another kind. */
    isEventFullyResolved(event: AnyEvent, _target: TargetValue, _context: C, _additionalProperties = {}): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    isOptional(context: C, additionalProperties = {}): boolean {
        return this.getProperties(context, additionalProperties).optional;
    }

    moveFateEventCondition(event: GameEvent<EventName.OnMoveFate>): boolean {
        if(event.origin) {
            if(event.origin.getFate() === 0) {
                return false;
            } else if(
                event.origin.type === CardType.Character &&
                !event.origin.allowGameAction('removeFate', event.context)
            ) {
                return false;
            }
        }
        if(event.recipient) {
            if(
                event.recipient.type === CardType.Character &&
                !event.recipient.allowGameAction('placeFate', event.context)
            ) {
                return false;
            }
        }
        return !!event.origin || !!event.recipient;
    }

    moveFateEventHandler(event: GameEvent<EventName.OnMoveFate>): void {
        let fate = event.fate ?? 0;
        if(event.origin) {
            fate = Math.min(fate, event.origin.getFate());
            event.fate = fate;
            event.origin.modifyFate(-fate);
        }
        if(event.recipient) {
            event.recipient.modifyFate(fate);
        }
    }

    hasTargetsChosenByInitiatingPlayer(_context: C, _additionalProperties = {}): boolean {
        return false;
    }
}
