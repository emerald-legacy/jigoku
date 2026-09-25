import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class BurnishedReputation extends DrawCard {
    static id = 'burnished-reputation';

    setupCardAbilities() {
        this.action('Honor a participating character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.honor());
    }
}
