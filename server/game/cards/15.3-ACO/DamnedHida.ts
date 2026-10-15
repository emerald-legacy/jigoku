import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';

class DamnedHida extends DrawCard {
    static id = 'damned-hida';

    override setupCardAbilities() {
        this.dire({
            effect: modifyMilitarySkill(3)
        });
    }
}


export default DamnedHida;
