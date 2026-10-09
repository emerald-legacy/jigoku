import DrawCard from '../../DrawCard.js';
import { CardType, CharacterStatus, Players } from '../../Constants.js';
import { putIntoPlay, removeFromGame } from '../../GameActions/GameActions.js';

class ShadowStep extends DrawCard {
    static id = 'shadow-step';

    setupCardAbilities() {
        this.action('Remove a character from the game and put it into play')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.hasTrait('mythic'),
                controller: Players.Self
            }, removeFromGame((context) => ({
                target: context.target
            })))
            .chatText('remove {0} from the game, then put it back into play')
            .afterwards()
            .if((context) => !!context.target?.hasTrait('shadow'))
            .gameAction(putIntoPlay((context) => ({ target: context.target })))
            .otherwise()
            .gameAction(putIntoPlay((context) => ({ target: context.target, status: CharacterStatus.Dishonored })));
    }
}


export default ShadowStep;
