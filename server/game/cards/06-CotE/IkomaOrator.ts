import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';

class IkomaOrator extends DrawCard {
    static id = 'ikoma-orator';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.isMoreHonorable(),
            effect: modifyPoliticalSkill(2)
        });
    }
}


export default IkomaOrator;
