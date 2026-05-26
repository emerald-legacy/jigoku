import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class YogoOutcast extends DrawCard {
    static id = 'yogo-outcast';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context => context.player.isLessHonorable(),
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}


export default YogoOutcast;

