import DrawCard from '../../../DrawCard.js';
import { canContributeGloryWhileBowed } from '../../../effects.js';

export default class MiyaKogara extends DrawCard {
    static id = 'miya-kogara';

    setupCardAbilities() {
        this.persistentEffect({
            effect: canContributeGloryWhileBowed()
        });
    }
}
