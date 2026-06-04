import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoYouth extends DrawCard {
    static id = 'moto-youth';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict('military') && this.game.conflictRecord.every(conflict => (
                conflict.declaredType !== 'military' && !conflict.typeSwitched || !conflict.completed || conflict.uuid === this.game.currentConflict?.uuid
            )),
            effect: ability.effects.modifyMilitarySkill(1)
        });
    }
}


export default MotoYouth;
