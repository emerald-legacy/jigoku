import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EffectNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Ring from '../Ring.js';
import { GameAction, GameActionProperties } from './GameAction.js';
import { LoseFateAction } from './LoseFateAction.js';

import type { Event } from '../Events/Event.js';
export interface CardActionProperties extends GameActionProperties {
    target?: BaseCard | BaseCard[];
}

interface UnlessActionCost {
    actionName: string;
    cost: GameAction | ((card: BaseCard) => GameAction);
}

export class CardGameAction<P extends CardActionProperties = CardActionProperties> extends GameAction<P> {
    targetType = [
        CardTypes.Character,
        CardTypes.Attachment,
        CardTypes.Holding,
        CardTypes.Event,
        CardTypes.Stronghold,
        CardTypes.Province,
        CardTypes.Role,
        'ring'
    ];

    defaultTargets(context: AbilityContext): BaseCard[] {
        return [context.source];
    }

    checkEventCondition(event: Event, additionalProperties = {}): boolean {
        return this.canAffect(event.card as BaseCard, event.context as AbilityContext, additionalProperties);
    }

    canAffect(target: BaseCard | Ring, context: AbilityContext, additionalProperties = {}): boolean {
        return super.canAffect(target, context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        const { target } = this.getProperties(context, additionalProperties);
        for(const card of target as BaseCard[]) {
            let allCostsPaid = true;
            const additionalCosts = card
                .getEffects<UnlessActionCost>(EffectNames.UnlessActionCost)
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
                    if(
                        (!context.costs ||
                            !context.costs.targetingCostPaid ||
                            !(context.costs.targetingCostPaid as BaseCard[]).includes(costTarget)) &&
                        targetingCosts > 0
                    ) {
                        if(!context.costs.targetingCostPaid) {
                            context.costs.targetingCostPaid = [];
                        }
                        (context.costs.targetingCostPaid as BaseCard[]).push(costTarget);
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

    addPropertiesToEvent(event: Event, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.card = card;
    }

    isEventFullyResolved(event: Event, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown>): boolean {
        return event.card === card && super.isEventFullyResolved(event, card, context, additionalProperties);
    }

    updateLeavesPlayEvent(event: Event, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown>): void {
        let properties = this.getProperties(context, additionalProperties) as P & { destination?: Locations };
        super.updateEvent(event, card, context, additionalProperties);
        event.isSacrifice = this.name === 'sacrifice';
        event.destination =
            properties.destination || (card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        event.preResolutionEffect = () => {
            const evCard = event.card as DrawCard;
            event.cardStateWhenLeftPlay = evCard.createSnapshot();
            if(evCard.isAncestral() && event.isContingent) {
                event.destination = Locations.Hand;
                context.game.addMessage(
                    '{0} returns to {1}\'s hand due to its Ancestral keyword',
                    evCard,
                    evCard.owner
                );
            }
        };
        event.createContingentEvents = () => {
            let contingentEvents = [];
            const evCard = event.card as DrawCard;
            // Add an imminent triggering condition for all attachments leaving play

            for(const attachment of (evCard.attachments ?? []) as DrawCard[]) {
                // we only need to add events for attachments that are in play.
                if(attachment.location === Locations.PlayArea) {
                    let attachmentEvent = context.game.actions
                        .discardFromPlay()
                        .getEvent(attachment, context.game.getFrameworkContext());
                    attachmentEvent.order = event.order - 1;
                    let previousCondition = attachmentEvent.condition;
                    attachmentEvent.condition = (attachmentEvent) =>
                        previousCondition(attachmentEvent) && attachment.parent === evCard;
                    attachmentEvent.isContingent = true;
                    contingentEvents.push(attachmentEvent);
                }
            }

            // Add an imminent triggering condition for removing fate
            if(evCard.allowGameAction('removeFate', context.game.getFrameworkContext())) {
                let fateEvent = context.game.actions
                    .removeFate({ amount: evCard.getFate() })
                    .getEvent(evCard, context.game.getFrameworkContext());
                fateEvent.order = event.order - 1;
                fateEvent.isContingent = true;
                contingentEvents.push(fateEvent);
            }
            return contingentEvents;
        };
    }

    leavesPlayEventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        const card = event.card as DrawCard;
        this.checkForRefillProvince(card, event, additionalProperties);
        if(!card.owner.isLegalLocationForCard(card, event.destination as Locations)) {
            card.game.addMessage(
                '{0} is not a legal location for {1} and it is discarded',
                event.destination,
                card
            );
            event.destination = card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile;
        }
        card.owner.moveCard(card, event.destination as Locations, event.options || {});
    }

    checkForRefillProvince(card: BaseCard, event: Event, additionalProperties: Record<string, unknown> = {}): void {
        if(!card.isInProvince() || card.location === Locations.StrongholdProvince) {
            return;
        }
        const eventContext = event.context as AbilityContext & { event?: Event };
        const context = additionalProperties.replacementEffect && eventContext.event
            ? (eventContext.event.context as AbilityContext)
            : eventContext;
        context.refillProvince(card.controller, card.location);
    }
}
