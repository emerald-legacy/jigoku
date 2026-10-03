import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class YogoOutcast extends DrawCard {
    static id = 'yogo-outcast';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.isLessHonorable(),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });
    }
}


export default YogoOutcast;

