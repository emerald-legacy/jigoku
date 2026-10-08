import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';

class MatsuSwiftspear extends DrawCard {
    static id = 'matsu-swiftspear';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length,
            effect: modifyMilitarySkill(2)
        });
    }
}


export default MatsuSwiftspear;

