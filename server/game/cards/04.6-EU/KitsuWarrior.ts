import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';
import { countClaimedRings } from '../claimedRings.js';

class KitsuWarrior extends DrawCard {
    static id = 'kitsu-warrior';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.modifyMilitarySkill(() => 2 * countClaimedRings(this.game, (ring) => ring.isConflictType(ConflictType.Military))),
                AbilityDsl.effects.modifyPoliticalSkill(() => 2 * countClaimedRings(this.game, (ring) => ring.isConflictType(ConflictType.Political)))
            ]
        });
    }
}


export default KitsuWarrior;
