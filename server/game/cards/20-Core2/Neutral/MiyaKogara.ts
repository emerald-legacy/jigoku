import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class MiyaKogara extends DrawCard {
    static id = 'miya-kogara';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.canContributeGloryWhileBowed()
        });
    }
}
