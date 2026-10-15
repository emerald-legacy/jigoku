import { doesNotBow } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType, Trait } from '../../../Constants.js';

export default class Sashimono extends DrawCard {
    static id = 'sashimono';

    setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: Trait.Bushi });

        this.whileAttached({
            condition: () => this.game.isDuringConflict(ConflictType.Military),
            effect: doesNotBow()
        });
    }
}
