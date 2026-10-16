import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, type RestrictionType, Stage } from '../Constants.js';
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
export type ActionEvent<EventType extends EventName, Context extends AbilityContext> = GameEvent<EventType> & { context: Context };

/** A `target` property as a list: `getProperties` has already made it one, but its type still allows a single target. */
export function targetList<Value>(target: Value | Value[] | undefined): Value[] {
    return Array.isArray(target) ? target : target ? [target] : [];
}

export type Defaults<Properties, Defaulted extends keyof Properties> = { [Key in Defaulted]-?: NonNullable<Properties[Key]> };

export type WithDefaults<Properties, Defaulted extends keyof Properties> = Properties & Defaults<Properties, Defaulted>;

/** Sets each key of `defaults` that `properties` leaves missing or `undefined`. */
function fillDefaults<Container extends object>(properties: Partial<Container>, defaults: Partial<Container>): void {
    for(const key in defaults) {
        const value = defaults[key];
        if(properties[key] === undefined && value !== undefined) {
            properties[key] = value;
        }
    }
}

/** What a caller adds to an action's properties when it resolves or checks it, such as a composite's target. Never mutated. */
export type ActionOverrides = Readonly<Record<string, unknown>>;

/** A game action with what its holder passes it: a target's actions get what was chosen for the target. */
export interface HeldAction {
    action: GameAction;
    overrides: ActionOverrides;
}

/** One effect message for several actions: "a, b and c". */
export function joinEffectMessages(context: AbilityContext, actions: HeldAction[]): MessageArgs {
    if(actions.length === 1) {
        return actions[0].action.getEffectMessage(context, actions[0].overrides);
    }
    const message = actions.map((_, i) => `{${i}}`).join(', ').replace(/, (?=[^,]*$)/, ' and ');
    return [message, actions.map(({ action, overrides }) => context.game.gameChat.nested(action.getEffectMessage(context, overrides)))];
}

const baseDefaults = { cannotBeCancelled: false, optional: false };

const hasTarget = (properties: object | undefined) => !!properties && 'target' in properties;

/** `Defaulted` names the properties `defaultProperties` supplies, which `getProperties` returns as non-optional. */
export class GameAction<
    Properties extends GameActionProperties = GameActionProperties,
    EventType extends EventName = EventName,
    Context extends AbilityContext = AbilityContext,
    Defaulted extends keyof Properties = never
> {
    properties?: Properties;
    targetType: string[] = [];
    eventName = EventName.Unnamed;
    name = '';
    /** What a restriction names to forbid this action; without one, only restrictions that name no type apply. */
    restriction?: RestrictionType;
    cost = '';
    effect = '';
    isNoAction?: boolean;
    defaultProperties?: Partial<Properties> & Defaults<Properties, Defaulted>;
    // Method syntax keeps an action for a narrower context assignable to GameAction.
    readonly #own: { resolve(context: Context): Properties };

    constructor(propertyFactory: Properties | ((context: Context) => Properties)) {
        if(typeof propertyFactory === 'function') {
            this.#own = { resolve: propertyFactory };
        } else {
            this.properties = propertyFactory;
            this.#own = { resolve: () => propertyFactory };
        }
    }

    defaultTargets(_context: Context): GameObject[] {
        return [];
    }

    getProperties(context: Context, additionalProperties: ActionOverrides = {}): WithDefaults<Properties, Defaulted | 'cannotBeCancelled' | 'optional'> {
        return this.#resolveProperties(context, additionalProperties).properties;
    }

    /**
     * A composite's properties and what it passes the actions it holds, from one evaluation: its caller's overrides,
     * plus its target when it was given one (by its own properties or its caller). Without one, each keeps its own default target.
     */
    protected getCompositeProperties(
        context: Context,
        additionalProperties: ActionOverrides = {}
    ): { properties: WithDefaults<Properties, Defaulted | 'cannotBeCancelled' | 'optional'>; overrides: ActionOverrides } {
        const { properties, targetGiven } = this.#resolveProperties(context, additionalProperties);
        const overrides: ActionOverrides = targetGiven ? { ...additionalProperties, target: properties.target } : additionalProperties;
        return { properties, overrides };
    }

    #resolveProperties(context: Context, additionalProperties: ActionOverrides) {
        const defaults = this.defaultProperties;
        const own = this.#own.resolve(context);
        const properties = Object.assign(
            { target: this.defaultTargets(context) },
            baseDefaults,
            defaults,
            additionalProperties,
            own
        );
        fillDefaults<GameActionProperties>(properties, baseDefaults);
        if(defaults) {
            fillDefaults<Properties>(properties, defaults);
        }
        const rawTarget: GameActionTarget | GameActionTarget[] | undefined = properties.target;
        const targets = (Array.isArray(rawTarget) ? rawTarget : [rawTarget]).filter((target) => !!target);
        const targetGiven = hasTarget(additionalProperties) || hasTarget(own);
        return { properties: Object.assign(properties, { target: targets }), targetGiven };
    }

    getCostMessage(_context: Context): undefined | MessageArgs {
        return [this.cost, []];
    }

    /** The effect message with `effectMessageTarget` as `{0}`, in front of `effectMessage`'s arguments. */
    getEffectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const [format, args] = this.effectMessage(context, additionalProperties);
        return [format, [this.effectMessageTarget(context, additionalProperties), ...args]];
    }

    /** The effect message, with its arguments from `{1}` on. */
    protected effectMessage(_context: Context, _additionalProperties = {}): MessageArgs {
        return [this.effect, []];
    }

    /** `{0}` of the effect message: `undefined` for a message without one. */
    protected effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        return this.getProperties(context, additionalProperties).target;
    }

    canAffect(target: GameObject, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { cannotBeCancelled } = this.getProperties(context, additionalProperties);
        return (
            this.targetType.includes(target.type) &&
            !context.gameActionsResolutionChain.some((action) => action === this) &&
            ((context.stage === Stage.Effect && cannotBeCancelled) || target.checkRestrictions(this.restriction, context))
        );
    }

    #targets(context: Context, additionalProperties: ActionOverrides = {}): GameActionTarget[] {
        return targetList(this.getProperties(context, additionalProperties).target);
    }

    hasLegalTarget(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        for(const candidateTarget of this.#targets(context, additionalProperties)) {
            if(this.canAffect(candidateTarget, context, additionalProperties)) {
                return true;
            }
        }
        return false;
    }

    allTargetsLegal(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        for(const candidateTarget of this.#targets(context, additionalProperties)) {
            if(!this.canAffect(candidateTarget, context, additionalProperties)) {
                return false;
            }
        }
        return true;
    }

    addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        for(const target of this.#targets(context, additionalProperties)) {
            if(this.canAffect(target, context, additionalProperties)) {
                events.push(this.getEvent(target, context, additionalProperties));
            }
        }
    }

    getEvent(target: TargetValue, context: Context, additionalProperties: ActionOverrides = {}): ActionEvent<EventType, Context> {
        const event = this.createEvent(target, context, additionalProperties);
        this.updateEvent(event, target, context, additionalProperties);
        return event;
    }

    updateEvent(event: ActionEvent<EventType, Context>, target: TargetValue, context: Context, additionalProperties: ActionOverrides = {}): void {
        event.name = this.eventName;
        this.addPropertiesToEvent(event, target, context, additionalProperties);
        event.replaceHandler(() => this.eventHandler(event, additionalProperties));
        event.condition = () => this.checkEventCondition(event, additionalProperties);
    }

    createEvent(target: TargetValue, context: Context, additionalProperties: ActionOverrides = {}): ActionEvent<EventType, Context> {
        const { cannotBeCancelled } = this.getProperties(context, additionalProperties);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- filled in by addPropertiesToEvent; checkEventCondition cancels a wrong kind
        const event = new Event(EventName.Unnamed, { cannotBeCancelled, context }) as ActionEvent<EventType, Context>;
        event.checkFullyResolved = (eventAtResolution) =>
            this.isEventFullyResolved(eventAtResolution, target, context, additionalProperties);
        return event;
    }

    resolve(
        target: undefined | GameActionTarget | GameActionTarget[],
        context: Context
    ): void {
        const events: Event[] = [];
        this.addEventsToArray(events, context, target ? { target } : {});
        context.game.queueSimpleStep(() => context.game.openEventWindow(events));
    }

    getEventArray(context: Context, additionalProperties: ActionOverrides = {}): Event[] {
        const events: Event[] = [];
        this.addEventsToArray(events, context, additionalProperties);
        return events;
    }

    addPropertiesToEvent(event: ActionEvent<EventType, Context>, _target: TargetValue, context: Context, _additionalProperties = {}): void {
        event.context = context;
    }

    eventHandler(_event: ActionEvent<EventType, Context>, _additionalProperties = {}): void {}

    checkEventCondition(_event: ActionEvent<EventType, Context>, _additionalProperties = {}): boolean {
        return true;
    }

    /** `event` is the event that finally resolved, which a replacement effect may have swapped for another kind. */
    isEventFullyResolved(event: AnyEvent, _target: TargetValue, _context: Context, _additionalProperties = {}): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    isOptional(context: Context, additionalProperties: ActionOverrides = {}): boolean {
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

    hasTargetsChosenByInitiatingPlayer(_context: Context, _additionalProperties = {}): boolean {
        return false;
    }
}
