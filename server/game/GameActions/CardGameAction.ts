import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EffectName, type EventName, Location, ALL_CARD_TYPES, ObjectType } from '../Constants.js';
import { GameAction, type GameActionProperties, targetList, type ActionEvent } from './GameAction.js';
import { payAdditionalCost } from '../costs/additionalCost.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';
import { Event } from '../Events/Event.js';

export interface CardActionProperties extends GameActionProperties {
    target?: BaseCard | BaseCard[];
}

export type CardEvent<EventType extends EventName, Context extends AbilityContext> = ActionEvent<EventType, Context> & { card: BaseCard };

export class CardGameAction<
    Properties extends CardActionProperties = CardActionProperties,
    EventType extends EventName = EventName,
    Context extends AbilityContext = AbilityContext,
    Defaulted extends keyof Properties = never
> extends GameAction<Properties, EventType, Context, Defaulted> {
    override targetType = [...ALL_CARD_TYPES, ObjectType.Ring];

    override defaultTargets(context: Context): BaseCard[] {
        return [context.source];
    }

    override checkEventCondition(event: ActionEvent<EventType, Context>, additionalProperties: ActionOverrides = {}): boolean {
        return !!event.card && this.canAffect(event.card, event.context, additionalProperties);
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const { target } = this.getProperties(context, additionalProperties);
        for(const card of targetList(target)) {
            let allCostsPaid = true;
            const additionalCosts = card.getEffects(EffectName.UnlessActionCost)
                .filter((properties) => properties.actionName === this.name);

            if(additionalCosts.length > 0) {
                // no payment for an action that can't affect the card
                if(!this.canAffect(card, context, additionalProperties)) {
                    continue;
                }
                for(const properties of additionalCosts) {
                    context.game.queueSimpleStep(() => {
                        const cost = typeof properties.cost === 'function' ? properties.cost(card) : properties.cost;
                        const purpose = context.game.gameChat.nested(this.getEffectMessage(context, additionalProperties));
                        if(!payAdditionalCost(context, card.controller, cost, card, purpose)) {
                            allCostsPaid = false;
                        }
                    });
                }
                context.game.queueSimpleStep(() => {
                    if(allCostsPaid) {
                        events.push(this.getEvent(card, context, additionalProperties));
                    }
                });
            } else {
                events.push(this.getEvent(card, context, additionalProperties));
            }
        }
    }

    override addPropertiesToEvent(event: ActionEvent<EventType, Context>, card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.card = card;
    }

    override isEventFullyResolved(event: AnyEvent, card: BaseCard, context: Context, additionalProperties: Record<string, unknown>): boolean {
        return event.card === card && super.isEventFullyResolved(event, card, context, additionalProperties);
    }

    checkForRefillProvince(card: BaseCard, event: { context: Context }, additionalProperties: ActionOverrides = {}): void {
        if(!card.isInProvince() || card.location === Location.StrongholdProvince) {
            return;
        }
        const triggeringContext = additionalProperties.replacementEffect && 'event' in event.context && event.context.event instanceof Event
            ? event.context.event.context
            : null;
        const context = triggeringContext ?? event.context;
        context.refillProvince(card.controller, card.location);
    }
}
