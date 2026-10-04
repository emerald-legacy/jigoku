import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { ConflictType } from '../../Constants.js';

class MotoYouth extends DrawCard {
    static id = 'moto-youth';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(ConflictType.Military) && this.game.conflictRecord.every(conflict => (
                conflict.declaredType !== ConflictType.Military && !conflict.typeSwitched || !conflict.completed || conflict.uuid === this.game.currentConflict?.uuid
            )),
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });
    }
}


export default MotoYouth;
