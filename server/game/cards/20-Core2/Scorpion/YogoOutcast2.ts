import { modifyBothSkills } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class YogoOutcast2 extends DrawCard {
    static id = 'yogo-outcast-2';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.isLessHonorable(),
            effect: modifyBothSkills(1)
        });
    }
}
