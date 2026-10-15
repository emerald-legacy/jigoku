import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';

class PoliticalRival extends DrawCard {
    static id = 'political-rival';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            effect: modifyPoliticalSkill(3)
        });
    }
}


export default PoliticalRival;
