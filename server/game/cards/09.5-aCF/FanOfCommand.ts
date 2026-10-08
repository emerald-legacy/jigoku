import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { ready } from '../../GameActions/GameActions.js';

class FanOfCommand extends DrawCard {
    static id = 'fan-of-command';

    setupCardAbilities() {
        this.action('Ready a character')
            .condition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('bushi')
            }, ready());
    }
}


export default FanOfCommand;
