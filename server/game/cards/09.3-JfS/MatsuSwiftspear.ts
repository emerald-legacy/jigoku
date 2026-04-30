import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';

class MatsuSwiftspear extends DrawCard {
    static id = 'matsu-swiftspear';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }
}


export default MatsuSwiftspear;

