import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class LurkingAffliction extends DrawCard {
    static id = 'lurking-affliction';

    setupCardAbilities() {
        this.action({
            title: 'Taint a participating character',

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.taint()
            }
        });
    }
}


export default LurkingAffliction;
