import { modifyMilitarySkill, modifyPoliticalSkill } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';
import { countClaimedRings } from '../claimedRings.js';

class KitsuWarrior extends DrawCard {
    static id = 'kitsu-warrior';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                modifyMilitarySkill(() => 2 * countClaimedRings(this.game, (ring) => ring.isConflictType(ConflictType.Military))),
                modifyPoliticalSkill(() => 2 * countClaimedRings(this.game, (ring) => ring.isConflictType(ConflictType.Political)))
            ]
        });
    }
}


export default KitsuWarrior;
