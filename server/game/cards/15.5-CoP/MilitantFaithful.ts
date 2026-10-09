import DrawCard from '../../DrawCard.js';
import { doesNotBow } from '../../effects.js';


class MilitantFaithful extends DrawCard {
    static id = 'militant-faithful';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!(context.player.opponent && context.player.opponent.anyCardsInPlay((card) => card.isParticipating() && !card.isOrdinary())),
            effect: doesNotBow()
        });
    }
}


export default MilitantFaithful;
