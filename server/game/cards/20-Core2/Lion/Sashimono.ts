import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class Sashimono extends DrawCard {
    static id = 'sashimono';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'bushi' });

        this.whileAttached({
            condition: () => this.game.isDuringConflict('military'),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
