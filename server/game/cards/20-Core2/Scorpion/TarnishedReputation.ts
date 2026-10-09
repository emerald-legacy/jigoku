import { CardType } from '../../../Constants.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TarnishedReputation extends DrawCard {
    static id = 'tarnished-reputation';

    setupCardAbilities() {
        this.action('Dishonor a participating character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, dishonor());
    }
}
