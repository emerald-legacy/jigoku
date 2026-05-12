import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes } from '../../Constants';

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
