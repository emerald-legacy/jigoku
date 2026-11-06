import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';
import { ConflictType } from '../../Constants.js';

class MotoYouth extends DrawCard {
    static id = 'moto-youth';

    override setupCardAbilities() {
        this.persistentEffect({
            // a switched conflict counts as both a military and a political conflict
            condition: () => {
                const current = this.game.currentConflict;
                return !!current && (current.declaredType === ConflictType.Military || current.conflictTypeSwitched) &&
                    this.game.conflictRecord.every((conflict) =>
                        conflict.uuid === current.uuid || !conflict.completed ||
                        conflict.declaredType !== ConflictType.Military && !conflict.typeSwitched
                    );
            },
            effect: modifyMilitarySkill(1)
        });
    }
}


export default MotoYouth;
