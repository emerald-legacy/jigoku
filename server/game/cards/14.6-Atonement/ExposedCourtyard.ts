import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Locations, Players, Durations } from '../../Constants.js';

const exposedCourtyardCost = () => ({
    action: { name: 'exposedCourtyardCost' },
    getActionName(_context: any) {
        return 'exposedCourtyardCost';
    },
    getCostMessage: function (_context: any) {
        return ['discarding {0}'];
    },
    canPay: function (context: any) {
        return context.player.conflictDeck.length >= 2;
    },
    resolve: function(context: any) {
        context.costs.exposedCourtyardCost = context.player.conflictDeck.slice(0, 2);
    },
    pay: function(context: any) {
        const discardedCards = context.costs.exposedCourtyardCost;
        discardedCards.slice(0, 2).forEach((card: any) => {
            card.controller.moveCard(card, Locations.ConflictDiscardPile);
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
                AbilityDsl.actions.selectCard((context: any) => ({
                    location: Locations.ConflictDiscardPile,
                    cardType: CardTypes.Event,
                    activePromptTitle: 'Choose an event',
                    controller: Players.Self,
                    targets: true,
                    subActionProperties: (card: any) => {
                        context.target = card;
                        return ({ target: card });
                    },
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.playerLastingEffect((context: any) => {
                            return {
                                targetController: context.player,
                                duration: Durations.Custom,
                                until: {
                                    onCardMoved: (event: any) => {
                                        return event.card === context.target && event.originalLocation === Locations.ConflictDiscardPile;
                                    },
                                    onConflictFinished: () => true
                                },
                                effect: AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDiscardPile, [context.target], this)
                            };
                        }),
                        AbilityDsl.actions.cardLastingEffect((context: any) => ({
                            duration: Durations.UntilEndOfConflict,
                            targetLocation: Locations.Any,
                            canChangeZoneNTimes: 2,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onCardPlayed: (event: any) => {
                                        return event.card === context.target && event.player === context.target.controller;
                                    }
                                },
                                multipleTrigger: true,
                                message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                                messageArgs: [context.target, context.source],
                                gameAction: AbilityDsl.actions.returnToDeck({
                                    location: Locations.Any,
                                    bottom: true
                                })
                            })
                        }))
                    ]),
                    message: '{0} can play {1} this conflict. It will be put on the bottom of the deck if it\'s played this conflict',
                    messageArgs: (card: any) => [context.player, card, context.source]
                }))
            ])
        });
    }
}


export default ExposedCourtyard;
