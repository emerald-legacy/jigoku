import { CardType } from '../../../Constants.js';
import { honor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class BurnishedReputation extends DrawCard {
    static id = 'burnished-reputation';

    override setupCardAbilities() {
        this.conflictAction('Honor a participating character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, honor());
    }
}
