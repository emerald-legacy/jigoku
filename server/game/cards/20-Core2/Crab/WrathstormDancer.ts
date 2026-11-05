import { Trait } from '../../../Constants.js';
import { doesNotBow } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class WrathstormDancer extends DrawCard {
    static id = 'wrathstorm-dancer';

    public override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => {
                const conflict = context.game.currentConflict;
                if(!conflict?.isParticipating(context.source)) {
                    return false;
                }
                const side = conflict.isAttacking(context.source) ? conflict.getAttackers() : conflict.getDefenders();
                return side.some((card) => card !== context.source && card.hasTrait(Trait.Berserker));
            },
            effect: doesNotBow()
        });
    }
}
