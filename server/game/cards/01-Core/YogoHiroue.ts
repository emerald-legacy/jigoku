import DrawCard from '../../DrawCard.js';
import { delayedEffect } from '../../effects.js';
import { cardLastingEffect, dishonor, menuPrompt, moveToConflict, sequential } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class YogoHiroue extends DrawCard {
    static id = 'yogo-hiroue';

    setupCardAbilities() {
        this.action('Move a character into the conflict')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character
            }, sequential([
                moveToConflict(),
                cardLastingEffect((context) => ({
                    effect: delayedEffect({
                        when: {
                            afterConflict: (event) => event.conflict.winner === context.player
                        },
                        gameAction: menuPrompt({
                            activePromptTitle: 'Dishonor ' + context.target.name + '?',
                            choices: ['Yes', 'No'],
                            choiceHandler: (choice, displayMessage) => {
                                if(displayMessage && choice === 'Yes') {
                                    context.game.addMessage('{0} chooses to dishonor {1} due to {2}\'s delayed effect', context.player, context.target, context.source);
                                }
                                return { target: (choice === 'Yes' ? context.target : []) };
                            },
                            gameAction: dishonor()
                        })
                    })
                }))
            ]))
            .chatText('move {0} into the conflict - they may choose to dishonor it if they win the conflict');
    }
}


export default YogoHiroue;
