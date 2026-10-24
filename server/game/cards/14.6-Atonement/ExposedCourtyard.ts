import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { canPlayFromOutOfPlay, delayedEffect, registerToPlayFromOutOfPlay } from '../../effects.js';
import { cardLastingEffect, discardCard, returnToDeck, selectCard, sequential } from '../../GameActions/GameActions.js';
import { CardType, Location, Players, ConflictType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';

class ExposedCourtyard extends DrawCard {
    static id = 'exposed-courtyard';

    override setupCardAbilities() {
        this.action('Make an event in your conflict discard playable')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .gameAction(sequential([
                discardCard((context) => ({ target: context.player.conflictDeck.slice(0, 2) })),
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
            .chatText((context) => msg`discard ${context.player.conflictDeck.slice(0, 2)} and pick an event to make playable this conflict`)
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
