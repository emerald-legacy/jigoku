import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EffectName, EventName, Location } from '../Constants.js';
import type Ring from '../Ring.js';
import { GameAction, GameActionProperties, targetList, type ActionEvent } from './GameAction.js';
import { LoseFateAction } from './LoseFateAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

import { Event } from '../Events/Event.js';
export interface CardActionProperties extends GameActionProperties {
    target?: BaseCard | BaseCard[];
}

/** An event a card action created: it names the card it affects. */
export type CardEvent<N extends EventName, C extends AbilityContext> = ActionEvent<N, C> & { card: BaseCard };

export class CardGameAction<P extends CardActionProperties = CardActionProperties, N extends EventName = EventName, C extends AbilityContext = AbilityContext> extends GameAction<P, N, C> {
    targetType = [
        CardType.Character,
        CardType.Attachment,
        CardType.Holding,
        CardType.Event,
        CardType.Stronghold,
        CardType.Province,
        CardType.Role,
        'ring'
    ];

    defaultTargets(context: C): BaseCard[] {
        return [context.source];
    }

    checkEventCondition(event: ActionEvent<N, C>, additionalProperties = {}): boolean {
        return !!event.card && this.canAffect(event.card, event.context, additionalProperties);
    }

    canAffect(target: BaseCard | Ring, context: C, additionalProperties = {}): boolean {
        return super.canAffect(target, context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        const { target } = this.getProperties(context, additionalProperties);
        for(const card of targetList(target)) {
            let allCostsPaid = true;
            const additionalCosts = card.getEffects(EffectName.UnlessActionCost)
                .filter((properties) => properties.actionName === this.name);

            if(context.player && context.ability && context.ability.targets && context.ability.targets.length > 0) {
                let targetForCost = [card];

                if(context.targets.challenger && context.targets.duelTarget) {
                    //duels act weird, we need to handle targeting differently for them to work
                    let duelTargets = Object.values<BaseCard | Array<BaseCard>>(context.targets).flat();
                    targetForCost = targetForCost.concat(duelTargets);
                }

                targetForCost.forEach((costTarget) => {
                    const targetingCosts = context.player.getTargetingCost(context.source, costTarget);
                    //we should only resolve the targeting costs once per card per target, even if it has multiple abilities - so track who we've already paid to target
                    const paid = context.costs.targetingCostPaid;
                    if((!Array.isArray(paid) || !paid.includes(costTarget)) && targetingCosts > 0) {
                        const paidTargets: unknown[] = Array.isArray(paid) ? paid : [];
                        context.costs.targetingCostPaid = paidTargets;
                        paidTargets.push(costTarget);
                        let properties = { amount: targetingCosts, target: context.player };
                        let cost = new LoseFateAction(properties);
                        if(cost.canAffect(context.player, context)) {
                            context.game.addMessage(
                                '{0} pays {1} fate in order to target {2}',
                                context.player,
                                targetingCosts,
                                costTarget.name
                            );
                            cost.resolve(context.player, context);
                        } else {
                            context.game.addMessage(
                                '{0} cannot pay {1} fate in order to target {2}',
                                context.player,
                                targetingCosts,
                                costTarget.name
                            );
                            allCostsPaid = false;
                        }
                    }
                });
            }

            if(additionalCosts.length > 0) {
                for(const properties of additionalCosts) {
                    context.game.queueSimpleStep(() => {
                        let cost = properties.cost;
                        if(typeof cost === 'function') {
                            cost = cost(card);
                        }
                        if(cost.hasLegalTarget(context)) {
                            cost.resolve(card, context);
                            context.game.addMessage(
                                '{0} {1} in order to {2}',
                                card.controller,
                                cost.getEffectMessage(context),
                                this.getEffectMessage(context, additionalProperties)
                            );
                        } else {
                            allCostsPaid = false;
                            context.game.addMessage(
                                '{0} cannot pay the additional cost required to {1}',
                                card.controller,
                                this.getEffectMessage(context, additionalProperties)
                            );
                        }
                    });
                }
                context.game.queueSimpleStep(() => {
                    if(allCostsPaid) {
                        events.push(this.getEvent(card, context, additionalProperties));
                    }
                });
            } else {
                if(allCostsPaid) {
                    events.push(this.getEvent(card, context, additionalProperties));
                }
            }
        }
    }

    addPropertiesToEvent(event: ActionEvent<N, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.card = card;
    }

    isEventFullyResolved(event: AnyEvent, card: BaseCard, context: C, additionalProperties: Record<string, unknown>): boolean {
        return event.card === card && super.isEventFullyResolved(event, card, context, additionalProperties);
    }

    checkForRefillProvince(card: BaseCard, event: { context: C }, additionalProperties: Record<string, unknown> = {}): void {
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
