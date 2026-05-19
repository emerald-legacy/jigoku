import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class StudentOfTheMethod extends DrawCard {
    static id = 'student-of-the-method';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.showBid === context.player.opponent?.showBid,
            effect: AbilityDsl.effects.modifyBothSkills(+2)
        });
    }
}
