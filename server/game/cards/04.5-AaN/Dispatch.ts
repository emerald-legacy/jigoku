import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Dispatch extends DrawCard {
    static id = 'dispatch';

    setupCardAbilities() {
        this.action({
            title: 'Move a character into or out of the conflict',
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('unicorn'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context, properties) => {
                        const target = properties.target;
                        if(!target || !Array.isArray(target)) {
                            return false;
                        }
                        const first = target[0] as any;
                        return !!first && first.inConflict;
                    },
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
