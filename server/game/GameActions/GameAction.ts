import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames, Stages } from '../Constants.js';
import { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';

type PlayerOrRingOrCardOrToken = Player | Ring | BaseCard | StatusToken;
type TargetValue = unknown;

export interface GameActionProperties {
    target?: PlayerOrRingOrCardOrToken | PlayerOrRingOrCardOrToken[];
    cannotBeCancelled?: boolean;
    optional?: boolean;
    parentAction?: GameAction<GameActionProperties>;
}

export class GameAction<P extends GameActionProperties = GameActionProperties, N extends EventNames = EventNames> {
    propertyFactory?: (context: AbilityContext) => P;
    properties?: P;
    targetType: string[] = [];
    eventName = EventNames.Unnamed;
    name = '';
    cost = '';
    effect = '';
    defaultProperties: P = { cannotBeCancelled: false, optional: false } as P;
    getDefaultTargets: (context: AbilityContext) => TargetValue = (context) => this.defaultTargets(context);

    constructor(propertyFactory: P | ((context: AbilityContext) => P)) {
        if(typeof propertyFactory === 'function') {
            this.propertyFactory = propertyFactory;
        } else {
            this.properties = propertyFactory;
        }
    }

    defaultTargets(_context: AbilityContext): GameObject[] {
        return [];
    }

    getProperties(context: AbilityContext, additionalProperties = {}): P {
        const properties = Object.assign(
            { target: this.getDefaultTargets(context) },
            this.defaultProperties,
            additionalProperties,
            this.properties ?? this.propertyFactory?.(context) ?? {}
        );
        const rawTarget = properties.target as TargetValue;
        const targetArray = Array.isArray(rawTarget) ? rawTarget : [rawTarget];
        properties.target = targetArray.filter(Boolean) as PlayerOrRingOrCardOrToken[];
        return properties;
    }

    getCostMessage(_context: AbilityContext): undefined | [string, unknown[]] {
        return [this.cost, []];
    }

    getEffectMessage(context: AbilityContext, additionalProperties = {}): [string, unknown[]] {
        let { target } = this.getProperties(context, additionalProperties);
        return [this.effect, [target]];
    }

    setDefaultTarget(func: (context: AbilityContext) => TargetValue): void {
        this.getDefaultTargets = func;
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        const { cannotBeCancelled } = this.getProperties(context, additionalProperties);
        return (
            this.targetType.includes(target.type) &&
            !context.gameActionsResolutionChain.includes(this) &&
            ((context.stage === Stages.Effect && cannotBeCancelled) || target.checkRestrictions(this.name, context))
        );
    }

    #targets(context: AbilityContext, additionalProperties = {}) {
        return this.getProperties(context, additionalProperties).target as PlayerOrRingOrCardOrToken[];
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        for(const candidateTarget of this.#targets(context, additionalProperties)) {
            if(this.canAffect(candidateTarget, context, additionalProperties)) {
                return true;
            }
        }
        return false;
    }

    allTargetsLegal(context: AbilityContext, additionalProperties = {}): boolean {
        for(const candidateTarget of this.#targets(context, additionalProperties)) {
            if(!this.canAffect(candidateTarget, context, additionalProperties)) {
                return false;
            }
        }
        return true;
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        for(const target of this.#targets(context, additionalProperties)) {
            if(this.canAffect(target, context, additionalProperties)) {
                events.push(this.getEvent(target, context, additionalProperties));
            }
        }
    }

    getEvent(target: TargetValue, context: AbilityContext, additionalProperties = {}): GameEvent<N> {
        const event = this.createEvent(target, context, additionalProperties);
        this.updateEvent(event, target, context, additionalProperties);
        return event;
    }

    updateEvent(event: GameEvent<N>, target: TargetValue, context: AbilityContext, additionalProperties = {}): void {
        event.name = this.eventName;
        this.addPropertiesToEvent(event, target, context, additionalProperties);
        event.replaceHandler((eventArg: Event) => this.eventHandler(eventArg as GameEvent<N>, additionalProperties));
        event.condition = () => this.checkEventCondition(event, additionalProperties);
    }

    createEvent(target: TargetValue, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): GameEvent<N> {
        const { cannotBeCancelled } = this.getProperties(context, additionalProperties);
        const event = new Event(EventNames.Unnamed, { cannotBeCancelled }) as GameEvent<N>;
        event.checkFullyResolved = (eventAtResolution) =>
            this.isEventFullyResolved(eventAtResolution as GameEvent<N>, target, context, additionalProperties);
        return event;
    }

    resolve(
        target: undefined | PlayerOrRingOrCardOrToken | PlayerOrRingOrCardOrToken[],
        context: AbilityContext
    ): void {
        if(target) {
            this.setDefaultTarget(() => target);
        }
        const events: Event[] = [];
        this.addEventsToArray(events, context);
        context.game.queueSimpleStep(() => context.game.openEventWindow(events));
    }

    getEventArray(context: AbilityContext, additionalProperties = {}): Event[] {
        const events: Event[] = [];
        this.addEventsToArray(events, context, additionalProperties);
        return events;
    }

    addPropertiesToEvent(event: GameEvent<N>, target: TargetValue, context: AbilityContext, _additionalProperties = {}): void {
        event.context = context;
    }

    eventHandler(event: GameEvent<N>, _additionalProperties = {}): void {}

    checkEventCondition(event: GameEvent<N>, _additionalProperties = {}): boolean {
        return true;
    }

    isEventFullyResolved(event: GameEvent<N>, target: TargetValue, context: AbilityContext, _additionalProperties = {}): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    isOptional(context: AbilityContext, additionalProperties = {}): boolean {
        return this.getProperties(context, additionalProperties).optional ?? false;
    }

    moveFateEventCondition(event: Event): boolean {
        if(event.origin) {
            if(event.origin.getFate() === 0) {
                return false;
            } else if(
                event.origin.type === CardTypes.Character &&
                !event.origin.allowGameAction('removeFate', (event.context as AbilityContext))
            ) {
                return false;
            }
        }
        if(event.recipient) {
            if(
                event.recipient.type === CardTypes.Character &&
                !event.recipient.allowGameAction('placeFate', (event.context as AbilityContext))
            ) {
                return false;
            }
        }
        return !!event.origin || !!event.recipient;
    }

    moveFateEventHandler(event: Event): void {
        if(event.origin) {
            event.fate = Math.min(event.fate, event.origin.getFate());
            event.origin.modifyFate(-event.fate);
        }
        if(event.recipient) {
            event.recipient.modifyFate(event.fate);
        }
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, _additionalProperties = {}): boolean {
        return false;
    }
}
