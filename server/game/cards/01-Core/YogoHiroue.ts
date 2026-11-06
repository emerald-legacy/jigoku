import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { delayedEffect } from '../../effects.js';
import { cardLastingEffect, dishonor, optional, moveToConflict, sequential } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class YogoHiroue extends DrawCard {
    static id = 'yogo-hiroue';

    override setupCardAbilities() {
        this.action('Move a character into the conflict')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isParticipating()
            }, sequential([
                moveToConflict(),
                cardLastingEffect((context) => ({
                    effect: delayedEffect({
                        when: {
                            afterConflict: (event) => event.conflict.winner === context.player
                        },
                        gameAction: optional({
                            activePromptTitle: 'Dishonor ' + context.target.name + '?',
                            gameAction: dishonor({ target: context.target }),
                            acceptMessage: () => msg`${context.player} chooses to dishonor ${context.target} due to ${context.source}'s delayed effect`
                        })
                    })
                }))
            ]))
            .chatText('move {0} into the conflict - they may choose to dishonor it if they win the conflict');
    }
}


export default YogoHiroue;
