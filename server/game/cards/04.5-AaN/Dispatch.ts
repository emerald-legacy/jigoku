import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Dispatch extends DrawCard {
    static id = 'dispatch';

    setupCardAbilities() {
        this.action({
            title: 'Move a character into or out of the conflict',
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('unicorn'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context, properties) => properties.target[0].inConflict,
                    trueGameAction: AbilityDsl.actions.sendHome(),
                    falseGameAction: AbilityDsl.actions.moveToConflict()
                }),
                message: '{0} chooses to {3} {1} {2}',
                messageArgs: (card, player) => [
                    player,
                    card,
                    card.inConflict ? 'home' : 'into the conflict',
                    card.inConflict ? 'send' : 'move'
                ]
            }),
            effect: 'choose a unicorn character they control to move into a conflict or home'
        });
    }
}


export default Dispatch;
