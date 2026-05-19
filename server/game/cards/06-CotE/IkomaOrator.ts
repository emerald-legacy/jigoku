import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class IkomaOrator extends DrawCard {
    static id = 'ikoma-orator';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.opponent && context.player.isMoreHonorable(),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
    }
}


export default IkomaOrator;
