import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KanjoDistrict extends DrawCard {
    static id = 'kanjo-district';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow and send home a participating character',
            cost: ability.costs.discardImperialFavor(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: [ability.actions.bow(), ability.actions.sendHome()]
            },
            effect: 'bow and send {0} home'
        });
    }
}


export default KanjoDistrict;
