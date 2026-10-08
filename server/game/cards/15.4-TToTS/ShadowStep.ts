import DrawCard from '../../DrawCard.js';
import { CardType, CharacterStatus, Players } from '../../Constants.js';
import { conditional, putIntoPlay, removeFromGame, sequential } from '../../GameActions/GameActions.js';

class ShadowStep extends DrawCard {
    static id = 'shadow-step';

    setupCardAbilities() {
        this.action('Remove a character from the game and put it into play')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.hasTrait('mythic'),
                controller: Players.Self
            }, sequential([
                removeFromGame((context) => ({
                    target: context.target
                })),
                conditional({
                    condition: (context) => {
                        return !!context.target?.hasTrait('shadow');
                    },
                    trueGameAction: putIntoPlay((context) => ({
                        target: context.target
                    })),
                    falseGameAction: putIntoPlay((context) => ({
                        target: context.target,
                        status: CharacterStatus.Dishonored
                    }))
                })
            ]))
            .chatText('remove {0} from the game, then put it back into play');
    }
}


export default ShadowStep;
