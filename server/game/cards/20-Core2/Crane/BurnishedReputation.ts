import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class BurnishedReputation extends DrawCard {
    static id = 'burnished-reputation';

    setupCardAbilities() {
        this.action({
            title: 'Honor a participating character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
