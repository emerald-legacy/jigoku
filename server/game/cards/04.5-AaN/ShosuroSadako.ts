import DrawCard from '../../DrawCard.js';
import { honorStatusReverseModifySkill } from '../../effects.js';

class ShosuroSadako extends DrawCard {
    static id = 'shosuro-sadako';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDishonored,
            effect: honorStatusReverseModifySkill()
        });
    }
}


export default ShosuroSadako;
