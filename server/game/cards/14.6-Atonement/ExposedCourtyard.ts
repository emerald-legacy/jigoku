import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { canPlayFromOwn, delayedEffect } from '../../effects.js';
import {
    cardLastingEffect,
    handler,
    playerLastingEffect,
    returnToDeck,
    selectCard,
    sequential
} from '../../GameActions/GameActions.js';
import { CardType, Location, Players, Duration, ConflictType } from '../../Constants.js';
import type { Cost } from '../../costs/Cost.js';

const exposedCourtyardCost = (): Cost<{ exposedCourtyardCost: DrawCard[] }> => ({
    getActionName(_context) {
        return 'exposedCourtyardCost';
    },
    getCostMessage(_context) {
        return ['discarding {0}'];
    },
    canPay(context) {
        return context.player.conflictDeck.length >= 2;
    },
    resolve(context) {
        context.costs.exposedCourtyardCost = context.player.conflictDeck.slice(0, 2);
    },
    pay(context) {
        const discardedCards = context.costs.exposedCourtyardCost ?? [];
        discardedCards.slice(0, 2).forEach((card) => {
            card.controller.moveCard(card, Location.ConflictDiscardPile);
        });
    }
});

class ExposedCourtyard extends DrawCard {
    static id = 'exposed-courtyard';

    setupCardAbilities() {
        this.action('Make an event in your conflict discard playable')
            .cost(exposedCourtyardCost())
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .gameAction(sequential([
                // always legal, so this can trigger when only the cards the cost discards give it a choice
                handler({
                    handler: () => true
                }),
                selectCard((context) => ({
                    location: Location.ConflictDiscardPile,
                    cardType: CardType.Event,
                    activePromptTitle: 'Choose an event',
                    controller: Players.Self,
                    targets: true,
                    subActionProperties: (card) => {
                        context.target = card;
                        return ({ target: card });
                    },
                    gameAction: sequential([
                        playerLastingEffect((context) => {
                            return {
                                targetController: context.player,
                                duration: Duration.Custom,
                                until: {
                                    onCardMoved: (event) => {
                                        return event.card === context.target && event.originalLocation === Location.ConflictDiscardPile;
                                    },
                                    onConflictFinished: () => true
                                },
                                effect: canPlayFromOwn(Location.ConflictDiscardPile, context.target?.isDrawCard() ? [context.target] : [], this)
                            };
                        }),
                        cardLastingEffect((context) => ({
                            targetLocation: Location.Any,
                            canChangeZoneNTimes: 2,
                            effect: delayedEffect({
                                when: {
                                    onCardPlayed: (event) => {
                                        return event.card === context.target && event.player === context.target?.controller;
                                    }
                                },
                                multipleTrigger: true,
                                message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                                messageArgs: [context.target, context.source],
                                gameAction: returnToDeck({
                                    location: Location.Any,
                                    bottom: true
                                })
                            })
                        }))
                    ]),
                    message: (context, card) => msg`${context.player} can play ${card} this conflict. It will be put on the bottom of the deck if it's played this conflict`}))
            ]))
            .chatText('pick an event to make playable this conflict')
            .cannotTargetFirst();
    }
}


export default ExposedCourtyard;
