import { ConflictType } from '../../Constants.js';
import { cannotParticipateAsAttacker, cannotParticipateAsDefender } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class StolenBreath extends DrawCard {
    static id = 'stolen-breath';

    override setupCardAbilities() {
        this.playOnlyIf((context) => !context.game.isDuringConflict());

        this.whileAttached({
            effect: [
                cannotParticipateAsAttacker(ConflictType.Political),
                cannotParticipateAsDefender(ConflictType.Political)
            ]
        });
    }
}


export default StolenBreath;
