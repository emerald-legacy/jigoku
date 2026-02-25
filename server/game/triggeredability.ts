import CardAbility from './CardAbility.js';
import { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import { Stages, CardTypes, EffectNames, AbilityTypes } from './Constants.js';
import type Game from './game';
import type BaseCard from './basecard';
import type Player from './player';
import type { Event } from './Events/Event';

type EventListener = (event: Event, context: TriggeredAbilityContext) => boolean;
type AggregateWhen = (events: Event[], context: TriggeredAbilityContext) => boolean;

interface TriggeredAbilityProperties {
    when?: Record<string, EventListener>;
    aggregateWhen?: AggregateWhen;
    anyPlayer?: boolean;
    collectiveTrigger?: boolean;
    [key: string]: any;
}

interface RegisteredEvent {
    name: string;
    handler: (...args: any[]) => void;
}

/**
 * Represents a reaction/interrupt ability provided by card text.
 *
 * Properties:
 * when    - object whose keys are event names to listen to for the reaction and
 *           whose values are functions that return a boolean about whether to
 *           trigger the reaction when that event is fired. For example, to
 *           trigger only at the end of the challenge phase, you would do:
 *           when: {
 *               onPhaseEnded: event => event.phase === 'conflict'
 *           }
 *           Multiple events may be specified for cards that have multiple
 *           possible triggers for the same reaction.
 * title   - string which is displayed to the player to reference this ability
 * cost    - object or array of objects representing the cost required to be
 *           paid before the action will activate. See Costs.
 * target  - object giving properties for the target API
 * handler - function that will be executed if the player chooses 'Yes' when
 *           asked to trigger the reaction. If the reaction has more than one
 *           choice, use the choices sub object instead.
 * limit   - optional AbilityLimit object that represents the max number of uses
 *           for the reaction as well as when it resets.
 * max     - optional AbilityLimit object that represents the max number of
 *           times the ability by card title can be used. Contrast with `limit`
 *           which limits per individual card.
 * location - string or array of strings indicating the location the card should
 *            be in in order to activate the reaction. Defaults to 'play area'.
 */

class TriggeredAbility extends CardAbility {
    when?: Record<string, EventListener>;
    aggregateWhen?: AggregateWhen;
    anyPlayer: boolean;
    collectiveTrigger: boolean;
    events: RegisteredEvent[] | null = null;

    constructor(game: Game, card: BaseCard, abilityType: AbilityTypes, properties: TriggeredAbilityProperties) {
        super(game, card, properties);
        this.when = properties.when;
        this.aggregateWhen = properties.aggregateWhen;
        this.anyPlayer = !!properties.anyPlayer;
        this.abilityType = abilityType;
        this.collectiveTrigger = !!properties.collectiveTrigger;
    }

    meetsRequirements(context: TriggeredAbilityContext, ignoredRequirements: string[] = []): string {
        const canOpponentTrigger =
            this.card.anyEffect(EffectNames.CanBeTriggeredByOpponent) &&
            this.abilityType !== AbilityTypes.ForcedInterrupt &&
            this.abilityType !== AbilityTypes.ForcedReaction;
        const canPlayerTrigger = this.anyPlayer || context.player === this.card.controller || canOpponentTrigger;

        if(!ignoredRequirements.includes('player') && !canPlayerTrigger) {
            if(
                this.card.type !== CardTypes.Event ||
                !context.player.isCardInPlayableLocation(this.card, context.playType)
            ) {
                return 'player';
            }
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    eventHandler(event: Event, window: any): void {
        for(const player of this.game.getPlayers()) {
            const context = this.createContext(player, event);
            if(
                this.card.reactions.includes(this) &&
                this.isTriggeredByEvent(event, context) &&
                this.meetsRequirements(context) === ''
            ) {
                window.addChoice(context);
            }
        }
    }

    checkAggregateWhen(events: Event[], window: any): void {
        for(const player of this.game.getPlayers()) {
            const context = this.createContext(player, events);
            if(
                this.card.reactions.includes(this) &&
                this.aggregateWhen?.(events, context) &&
                this.meetsRequirements(context) === ''
            ) {
                window.addChoice(context);
            }
        }
    }

    createContext(player: Player = this.card.controller, event?: Event | Event[]): TriggeredAbilityContext {
        return new TriggeredAbilityContext({
            event: event,
            game: this.game,
            source: this.card,
            player: player,
            ability: this,
            stage: Stages.PreTarget
        });
    }

    isTriggeredByEvent(event: Event, context: TriggeredAbilityContext): boolean {
        const listener = this.when?.[event.name];
        return Boolean(listener && listener(event, context));
    }

    registerEvents(): void {
        if(this.events) {
            return;
        } else if(this.aggregateWhen) {
            const event: RegisteredEvent = {
                name: 'aggregateEvent:' + this.abilityType,
                handler: (events: Event[], window: any) => this.checkAggregateWhen(events, window)
            };
            this.events = [event];
            this.game.on(event.name, event.handler);
            return;
        }

        const eventNames = Object.keys(this.when || {});

        this.events = [];
        eventNames.forEach((eventName) => {
            const event: RegisteredEvent = {
                name: eventName + ':' + this.abilityType,
                handler: (evt: Event, window: any) => this.eventHandler(evt, window)
            };
            this.game.on(event.name, event.handler);
            this.events?.push(event);
        });
    }

    unregisterEvents(): void {
        if(this.events) {
            this.events.forEach((event) => {
                this.game.removeListener(event.name, event.handler);
            });
            this.events = null;
        }
    }
}

export = TriggeredAbility;
