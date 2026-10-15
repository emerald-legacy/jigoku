import DrawCard from '../../DrawCard.js';
import { taint } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class LurkingAffliction extends DrawCard {
    static id = 'lurking-affliction';

    setupCardAbilities() {
        this.action('Taint a participating character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, taint());
    }
}


export default LurkingAffliction;
