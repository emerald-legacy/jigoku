import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { canPlayFromOutOfPlay, delayedEffect, registerToPlayFromOutOfPlay } from '../../effects.js';
import { cardLastingEffect, handler, returnToDeck, selectCard, sequential } from '../../GameActions/GameActions.js';
import { CardType, Location, Players, ConflictType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
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
                    subActionProperties: (card) => ({ target: card, effect: this.returnAfterPlay(context, card) }),
                    gameAction: sequential([
                        cardLastingEffect({
                            targetLocation: Location.ConflictDiscardPile,
                            effect: [canPlayFromOutOfPlay((player) => player === context.player), registerToPlayFromOutOfPlay()]
                        }),
                        // its effect comes from subActionProperties
                        cardLastingEffect({
                            targetLocation: Location.Any,
                            canChangeZoneNTimes: 2
                        })
                    ]),
                    message: (context, card) => msg`${context.player} can play ${card} this conflict. It will be put on the bottom of the deck if it's played this conflict`
                }))
            ]))
            .chatText('pick an event to make playable this conflict')
            .cannotTargetFirst();
    }

    private returnAfterPlay(context: AbilityContext, event: BaseCard) {
        return delayedEffect({
            when: {
                onCardPlayed: (played) => played.card === event && played.player === context.player
            },
            multipleTrigger: true,
            message: () => msg`${event} returns to the bottom of the deck due to ${context.source}'s effect`,
            gameAction: returnToDeck({
                location: Location.Any,
                bottom: true
            })
        });
    }
}


export default ExposedCourtyard;
