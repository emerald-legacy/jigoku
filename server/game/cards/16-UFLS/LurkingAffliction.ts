import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class LurkingAffliction extends DrawCard {
    static id = 'lurking-affliction';

    setupCardAbilities() {
        this.action('Taint a participating character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.taint());
    }
}


export default LurkingAffliction;
