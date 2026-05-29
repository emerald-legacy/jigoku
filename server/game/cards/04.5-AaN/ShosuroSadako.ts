import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShosuroSadako extends DrawCard {
    static id = 'shosuro-sadako';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDishonored,
            effect: AbilityDsl.effects.honorStatusReverseModifySkill()
        });
    }
}


export default ShosuroSadako;
