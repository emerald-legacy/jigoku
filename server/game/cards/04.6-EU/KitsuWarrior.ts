import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class KitsuWarrior extends DrawCard {
    static id = 'kitsu-warrior';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.modifyMilitarySkill(() => this.twiceMilClaimedRings()),
                AbilityDsl.effects.modifyPoliticalSkill(() => this.twicePolClaimedRings())
            ]
        });
    }

    twiceMilClaimedRings() {
        let milclaimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed() && ring.isConflictType(ConflictType.Military));
        return 2 * milclaimedRings.length;
    }
    twicePolClaimedRings() {
        let polclaimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed() && ring.isConflictType(ConflictType.Political));
        return 2 * polclaimedRings.length;
    }
}


export default KitsuWarrior;
