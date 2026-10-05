import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType } from '../../../Constants.js';

export default class Sashimono extends DrawCard {
    static id = 'sashimono';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'bushi' });

        this.whileAttached({
            condition: () => this.game.isDuringConflict(ConflictType.Military),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
