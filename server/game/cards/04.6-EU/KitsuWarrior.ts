import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

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
        // @ts-expect-error string literal 'military' vs ConflictTypes enum - game engine accepts both at runtime
        let milclaimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed() && ring.isConflictType('military'));
        return 2 * milclaimedRings.length;
    }
    twicePolClaimedRings() {
        // @ts-expect-error string literal 'political' vs ConflictTypes enum - game engine accepts both at runtime
        let polclaimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed() && ring.isConflictType('political'));
        return 2 * polclaimedRings.length;
    }
}


export default KitsuWarrior;
