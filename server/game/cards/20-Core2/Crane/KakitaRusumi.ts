import { CardType, Decks, Duration } from '../../../Constants.js';
import { delayedEffect } from '../../../effects.js';
import { discardFromPlay, putIntoConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

function statusOfIntern(context: AbilityContext) {
    return context.source.isHonored ? 'honored' : 'ordinary';
}

export default class KakitaRusumi extends DrawCard {
    static id = 'kakita-rusumi';

    setupCardAbilities() {
        this.conflictAction('Put a character into play', { evenFromHome: true })
            .condition((context) => context.player.isDefendingPlayer())
            .deckSearch({
                activePromptTitle: 'Choose a character to put into play',
                cardsToLookAt: 4,
                deck: Decks.DynastyDeck,
                cardCondition: (card) =>
                    card.type === CardType.Character && (card.printedCost ?? 0) <= 2 && card.isFaction('crane'),
                message: '{0} puts {1} into play {2}',
                messageArgs: (context, cards) => [context.player, cards, statusOfIntern(context)],
                shuffle: true,
                gameAction: putIntoConflict((context) => ({ status: statusOfIntern(context) }))
            })
            .effect('search their dynasty deck for a character to put into play')
            .then()
            .cardLastingEffect((context) => {
                const target = context.deckSearchSelected[0] ?? [];
                return {
                    target: target,
                    duration: Duration.UntilEndOfPhase,
                    effect: delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: '{0} is discarded from play due to {1}\'s effect',
                        messageArgs: [target, context.source],
                        gameAction: discardFromPlay()
                    })
                };
            });
    }
}
