import { modifyBothSkills } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class StudentOfTheMethod extends DrawCard {
    static id = 'student-of-the-method';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.showBid === context.player.opponent?.showBid,
            effect: modifyBothSkills(+2)
        });
    }
}
