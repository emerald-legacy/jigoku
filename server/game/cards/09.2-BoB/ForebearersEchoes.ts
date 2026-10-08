import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Duration, Location, Players, ConflictType } from '../../Constants.js';
import { delayedEffect } from '../../effects.js';
import { cardLastingEffect, joint, putIntoConflict, returnToDeck } from '../../GameActions/GameActions.js';

class ForebearersEchoes extends DrawCard {
    static id = 'forebearer-s-echoes';

    setupCardAbilities() {
        this.conflictAction('Put a character into play', { conflictType: ConflictType.Military })
            .target({
                activePromptTitle: 'Choose a character from your dynasty discard pile',
                location: Location.DynastyDiscardPile,
                controller: Players.Self,
                cardType: CardType.Character
            }, joint([
                putIntoConflict((context) => ({
                    target: context.target
                })),
                cardLastingEffect((context) => ({
                    target: context.target,
                    duration: Duration.UntilEndOfPhase,
                    location: [Location.DynastyDiscardPile, Location.PlayArea],
                    effect: delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: () => msg`${context.target} returns to the bottom of the dynasty deck due to the delayed effect of ${context.source}`,
                        gameAction: returnToDeck({ bottom: true })
                    })
                }))
            ]))
            .chatText('put {0} into play in the conflict and apply a lasting effect to {0}');
    }
}


export default ForebearersEchoes;
