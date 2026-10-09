import { msg } from '../../GameChat.js';
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
                                    context.game.addMessage(msg`${context.player} chooses to dishonor ${context.target} due to ${context.source}'s delayed effect`);
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
