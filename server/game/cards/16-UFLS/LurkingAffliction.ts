import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class LurkingAffliction extends DrawCard {
    static id = 'lurking-affliction';

    setupCardAbilities() {
        this.action({
            title: 'Taint a participating character',

            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.taint()
            }
        });
    }
}


export default LurkingAffliction;
