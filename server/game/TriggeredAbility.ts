import { CardAbility } from './CardAbility.js';
import type { CardAbilityProperties } from './CardAbility.js';
import { TriggeredAbilityContext, type TriggeringEvent } from './TriggeredAbilityContext.js';
import { Stage, CardType, EffectName, EventName, AbilityType, Blocker } from './Constants.js';
import { eventNamesIn, isEnumValue } from './utils/helpers.js';
import type { AbilityContext } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import type Player from './Player.js';
import { Event } from './Events/Event.js';
import type { OwnContextCallback, WhenType } from './Interfaces.js';

type AggregateContext<S extends BaseCard = BaseCard> = TriggeredAbilityContext<S, BaseCard, Event[]>;

export type TriggerChoice = TriggeredAbilityContext<BaseCard, BaseCard, AnyEventOrAggregate>;
type AnyEventOrAggregate = Exclude<TriggeringEvent, undefined>;

/** Where a triggered ability offers itself: the trigger window, or a cost check's stand-in that only counts choices. */
export interface ChoiceWindow {
    addChoice(context: TriggerChoice): void;
}


function fireWhen<N extends EventName>(when: WhenType, name: N, event: Event, context: TriggeredAbilityContext): unknown {
    const condition = when[name];
    return condition && event.is(name) && condition(event, context);
}

// Author-facing shape: `WhenType<S>` narrows each handler's event payload by event name and types
// `context.source` as `S`. The runtime fields below erase that back to base `Event`/`BaseCard`.
export interface TriggeredAbilityProperties<S extends BaseCard = BaseCard> extends CardAbilityProperties<TriggeredAbilityContext<S>> {
    when?: WhenType<S>;
    aggregateWhen?: OwnContextCallback<[events: Event[], context: AggregateContext<S>], boolean>;
    anyPlayer?: boolean;
    collectiveTrigger?: boolean;
}


export class TriggeredAbility<S extends BaseCard = BaseCard> extends CardAbility {
    when?: WhenType;
    aggregateWhen?: OwnContextCallback<[events: Event[], context: AggregateContext], boolean>;
    anyPlayer: boolean;
    collectiveTrigger: boolean;
    /** While registered, how to stop listening. */
    private unsubscribers: (() => void)[] | null = null;

    constructor(card: S, abilityType: AbilityType, properties: TriggeredAbilityProperties<S>) {
        super(card, properties);
        this.when = properties.when;
        this.aggregateWhen = properties.aggregateWhen;
        this.anyPlayer = !!properties.anyPlayer;
        this.abilityType = abilityType;
        this.collectiveTrigger = !!properties.collectiveTrigger;
    }

    meetsRequirements(context: AbilityContext, ignoredBlockers: Blocker[] = []): Blocker {
        const canOpponentTrigger =
            this.card.anyEffect(EffectName.CanBeTriggeredByOpponent) &&
            this.abilityType !== AbilityType.ForcedInterrupt &&
            this.abilityType !== AbilityType.ForcedReaction;
        const canPlayerTrigger = this.anyPlayer || context.player === this.card.controller || canOpponentTrigger;

        if(!ignoredBlockers.includes(Blocker.WrongPlayer) && !canPlayerTrigger) {
            if(
                this.card.type !== CardType.Event ||
                !context.player.isCardInPlayableLocation(this.card, context.playType)
            ) {
                return Blocker.WrongPlayer;
            }
        }

        if(!ignoredBlockers.includes(Blocker.ConditionNotMet) && this.condition && !this.condition(context)) {
            return Blocker.ConditionNotMet;
        }

        return super.meetsRequirements(context, ignoredBlockers);
    }

    eventHandler(event: Event, window: ChoiceWindow): void {
        for(const player of this.game.getPlayers()) {
            const context = this.createEventContext(player, event);
            if(
                this.card.reactions.includes(this) &&
                this.isTriggeredByEvent(event, context) &&
                this.meetsRequirements(context) === Blocker.None
            ) {
                window.addChoice(context);
            }
        }
    }

    checkAggregateWhen(events: Event[], window: ChoiceWindow): void {
        for(const player of this.game.getPlayers()) {
            const context = this.createAggregateContext(player, events);
            if(
                this.card.reactions.includes(this) &&
                this.aggregateWhen?.(events, context) &&
                this.meetsRequirements(context) === Blocker.None
            ) {
                window.addChoice(context);
            }
        }
    }

    /** A context for resolving this ability outside a trigger window, with the event it reacts to if any. */
    createContext(player: Player = this.card.controller, event?: Event | Event[]): TriggeredAbilityContext<BaseCard, BaseCard, TriggeringEvent> {
        return this.newContext(player, event);
    }

    createEventContext(player: Player, event: Event): TriggeredAbilityContext {
        return this.newContext(player, event);
    }

    createAggregateContext(player: Player, events: Event[]): AggregateContext {
        return this.newContext(player, events);
    }

    private newContext<E extends TriggeringEvent>(player: Player, event: E): TriggeredAbilityContext<BaseCard, BaseCard, E> {
        return new TriggeredAbilityContext({
            event,
            game: this.game,
            source: this.card,
            player: player,
            ability: this,
            stage: Stage.PreTarget
        });
    }

    isTriggeredByEvent(event: Event, context: TriggeredAbilityContext): boolean {
        return Boolean(this.when && isEnumValue(EventName, event.name) && fireWhen(this.when, event.name, event, context));
    }

    registerEvents(): void {
        if(this.unsubscribers) {
            return;
        }
        if(this.aggregateWhen) {
            const handler = (events: Event[], window: ChoiceWindow) => this.checkAggregateWhen(events, window);
            this.game.onAggregateWindow(this.abilityType, handler);
            this.unsubscribers = [() => this.game.offAggregateWindow(this.abilityType, handler)];
            return;
        }
        // a window for other effects has no choices to offer
        const handler = (event: Event, window?: ChoiceWindow) => window && this.eventHandler(event, window);
        const eventNames = eventNamesIn(this.when ?? {});
        for(const eventName of eventNames) {
            this.game.onTriggerWindow(eventName, this.abilityType, handler);
        }
        this.unsubscribers = eventNames.map((eventName) => () => this.game.offTriggerWindow(eventName, this.abilityType, handler));
    }

    unregisterEvents(): void {
        this.unsubscribers?.forEach((unsubscribe) => unsubscribe());
        this.unsubscribers = null;
    }
}

