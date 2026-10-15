import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';

class YogoOutcast extends DrawCard {
    static id = 'yogo-outcast';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.isLessHonorable(),
            effect: modifyBothSkills(1)
        });
    }
}


export default YogoOutcast;

