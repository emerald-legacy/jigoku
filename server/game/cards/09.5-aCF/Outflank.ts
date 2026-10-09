import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { perConflict } from '../../AbilityLimit.js';
import { cannotBeDeclaredAsDefender } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class Outflank extends DrawCard {
    static id = 'outflank';

    setupCardAbilities() {
        this.reaction('Prevent a character from declaring as a defender')
            .when({
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.player.opponent && this.game.isDuringConflict()
            })
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card) => !card.isUnique()
            }, cardLastingEffect({
                effect: cannotBeDeclaredAsDefender()
            }))
            .chatText('prevent {0} from declaring as a defender this conflict')
            .max(perConflict(1));
    }
}


export default Outflank;
