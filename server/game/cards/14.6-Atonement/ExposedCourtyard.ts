import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import { CardType, EventName, Location, Players, Duration } from '../../Constants.js';
import type { Cost } from '../../costs/Cost.js';

const exposedCourtyardCost = (): Cost => ({
    getActionName(_context: AbilityContext) {
        return 'exposedCourtyardCost';
    },
    getCostMessage: function (_context: AbilityContext) {
        return ['discarding {0}'];
    },
    canPay: function (context: AbilityContext) {
        return context.player.conflictDeck.length >= 2;
    },
    resolve: function(context: AbilityContext) {
        context.costs.exposedCourtyardCost = context.player.conflictDeck.slice(0, 2);
    },
    pay: function(context: AbilityContext) {
        const discardedCards = context.costs.exposedCourtyardCost as DrawCard[];
        discardedCards.slice(0, 2).forEach(card => {
            card.controller.moveCard(card, Location.ConflictDiscardPile);
        });
    }
});

class ExposedCourtyard extends DrawCard {
    static id = 'exposed-courtyard';

    setupCardAbilities() {
        this.action({
            title: 'Make an event in your conflict discard playable',
            effect: 'pick an event to make playable this conflict',
            cannotTargetFirst: true,
            condition: context => context.game.isDuringConflict('military'),
            cost: [exposedCourtyardCost()],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.handler({
                    handler: () => true
                }),
                AbilityDsl.actions.selectCard((context: AbilityContext) => ({
                    location: Location.ConflictDiscardPile,
                    cardType: CardType.Event,
                    activePromptTitle: 'Choose an event',
                    controller: Players.Self,
                    targets: true,
                    subActionProperties: card => {
                        context.target = card;
                        return ({ target: card });
                    },
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.playerLastingEffect((context: AbilityContext) => {
                            return {
                                targetController: context.player,
                                duration: Duration.Custom,
                                until: {
                                    onCardMoved: event => {
                                        return event.card === context.target && event.originalLocation === Location.ConflictDiscardPile;
                                    },
                                    onConflictFinished: () => true
                                },
                                effect: AbilityDsl.effects.canPlayFromOwn(Location.ConflictDiscardPile, [context.target as DrawCard], this)
                            };
                        }),
                        AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                            duration: Duration.UntilEndOfConflict,
                            targetLocation: Location.Any,
                            canChangeZoneNTimes: 2,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>) => {
                                        return event.card === context.target && event.player === context.target?.controller;
                                    }
                                },
                                multipleTrigger: true,
                                message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                                messageArgs: [context.target, context.source],
                                gameAction: AbilityDsl.actions.returnToDeck({
                                    location: Location.Any,
                                    bottom: true
                                })
                            })
                        }))
                    ]),
                    message: '{0} can play {1} this conflict. It will be put on the bottom of the deck if it\'s played this conflict',
                    messageArgs: card => [context.player, card, context.source]
                }))
            ])
        });
    }
}


export default ExposedCourtyard;
