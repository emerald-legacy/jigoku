import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';

class ShadowStalker extends DrawCard {
    static id = 'shadow-stalker';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.honor <= 6,
            effect: modifyBothSkills(2)
        });
    }
}


export default ShadowStalker;

