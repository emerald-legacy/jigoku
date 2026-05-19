import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class TarnishedReputation extends DrawCard {
    static id = 'tarnished-reputation';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor a participating character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}
