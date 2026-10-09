import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { gainAbility } from '../../effects.js';
import { menuPrompt, removeFate } from '../../GameActions/GameActions.js';

class YogoJunzo extends DrawCard {
    static id = 'yogo-junzo';

    setupCardAbilities() {
        this.dire({
            effect: gainAbility.action('Remove all fate from a character', (ability) => ability
                .target({
                    cardType: CardType.Character
                }, removeFate((context) => ({
                    amount: context.target?.getFate() ?? 0
                })))
                .chatText('remove all fate from {0}'))
        });

        this.action('Return any amount of fate from a character you control')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, menuPrompt((context) => ({
                activePromptTitle: 'Select fate amount:',
                choices: Array.from(Array(context.target.getFate()), (_x, i) => (i + 1).toString()),
                choiceHandler: (choice, displayMessage) => {
                    if(displayMessage) {
                        this.game.addMessage(msg`${context.player} chooses to move ${choice} fate from ${context.target} to ${context.player}'s pool`);
                    }
                    return { target: context.target, amount: parseInt(choice), recipient:context.target.controller };
                },
                gameAction: removeFate()
            })));
    }
}


export default YogoJunzo;
