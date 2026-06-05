import CardAbility from './CardAbility.js';
import { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import { Stage, CardType, EffectName, AbilityType } from './Constants.js';
import type BaseCard from './BaseCard.js';
import type Player from './Player.js';
import type { Event } from './Events/Event.js';
import type { WhenType } from './Interfaces.js';

// Runtime storage shape: events arrive un-narrowed, so the listener takes the base `Event`.
type EventListener = (event: Event, context: TriggeredAbilityContext) => unknown;
type AggregateWhen = (events: Event[], context: TriggeredAbilityContext) => boolean;

interface AbilityChoiceWindow {
    addChoice(context: TriggeredAbilityContext): void;
}

// Author-facing shape: `WhenType<S>` narrows each handler's event payload by event name and types
// `context.source` as `S`. The runtime fields below erase that back to base `Event`/`BaseCard`.
export interface TriggeredAbilityProperties<S extends BaseCard = BaseCard> {
    when?: WhenType<S>;
    // The target type does not affect aggregate triggers, so it is left open here; this lets the
    // author-facing `TriggeredAbilityProps<S, Target>` assign in with a single cast (any Target).
    aggregateWhen?: (events: Event[], context: TriggeredAbilityContext<S, any>) => boolean;
    anyPlayer?: boolean;
    collectiveTrigger?: boolean;
    [key: string]: unknown;
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

class TriggeredAbility<S extends BaseCard = BaseCard> extends CardAbility {
    when?: Record<string, EventListener>;
    aggregateWhen?: AggregateWhen;
    anyPlayer: boolean;
    collectiveTrigger: boolean;
    events: RegisteredEvent[] | null = null;

    constructor(card: S, abilityType: AbilityType, properties: TriggeredAbilityProperties<S>) {
        super(card, properties);
        // `S` types the author-facing `when`/`aggregateWhen` callbacks (context.source = the card subtype).
        // The runtime fields are erased to BaseCard so `TriggeredAbility<DrawCard>` stays assignable into
        // the `TriggeredAbility[]` collections (reactions etc.) — at runtime the context's source is the card.
        this.when = properties.when as Record<string, EventListener> | undefined;
        this.aggregateWhen = properties.aggregateWhen as AggregateWhen | undefined;
        this.anyPlayer = !!properties.anyPlayer;
        this.abilityType = abilityType;
        this.collectiveTrigger = !!properties.collectiveTrigger;
    }

    meetsRequirements(context: TriggeredAbilityContext, ignoredRequirements: string[] = []): string {
        const canOpponentTrigger =
            this.card.anyEffect(EffectName.CanBeTriggeredByOpponent) &&
            this.abilityType !== AbilityType.ForcedInterrupt &&
            this.abilityType !== AbilityType.ForcedReaction;
        const canPlayerTrigger = this.anyPlayer || context.player === this.card.controller || canOpponentTrigger;

        if(!ignoredRequirements.includes('player') && !canPlayerTrigger) {
            if(
                this.card.type !== CardType.Event ||
                !context.player.isCardInPlayableLocation(this.card, context.playType)
            ) {
                return 'player';
            }
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    eventHandler(event: Event, window: AbilityChoiceWindow): void {
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

    checkAggregateWhen(events: Event[], window: AbilityChoiceWindow): void {
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
            event: event as Event,
            game: this.game,
            source: this.card,
            player: player,
            ability: this,
            stage: Stage.PreTarget
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
                handler: (events: Event[], window: AbilityChoiceWindow) => this.checkAggregateWhen(events, window)
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
                handler: (evt: Event, window: AbilityChoiceWindow) => this.eventHandler(evt, window)
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

export default TriggeredAbility;
