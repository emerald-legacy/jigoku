import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class MatsuSwiftspear extends DrawCard {
    static id = 'matsu-swiftspear';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }
}


export default MatsuSwiftspear;

