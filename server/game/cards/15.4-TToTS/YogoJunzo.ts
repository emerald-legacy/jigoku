import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { gainAbility } from '../../effects.js';
import { chooseAmount, removeFate } from '../../GameActions/GameActions.js';

class YogoJunzo extends DrawCard {
    static id = 'yogo-junzo';

    override setupCardAbilities() {
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
            }, chooseAmount((context) => ({
                activePromptTitle: 'Select fate amount:',
                max: context.target.getFate(),
                gameAction: (amount) => removeFate({ amount, recipient: context.target.controller }),
                message: (context, amount) => msg`${context.player} chooses to move ${amount} fate from ${context.target} to ${context.player}'s pool`
            })));
    }
}


export default YogoJunzo;
