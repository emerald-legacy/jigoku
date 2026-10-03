import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class TarnishedReputation extends DrawCard {
    static id = 'tarnished-reputation';

    setupCardAbilities() {
        this.action('Dishonor a participating character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.dishonor());
    }
}
