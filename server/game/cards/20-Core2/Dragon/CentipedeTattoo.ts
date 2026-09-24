import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class CentipedeTattoo extends DrawCard {
    static id = 'centipede-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'monk' });

        this.whileAttached({ effect: AbilityDsl.effects.addKeyword('tattooed') });

        this.whileAttached({
            condition: () =>
                !!this.parentCharacter && !!this.game.currentConflict &&
                this.parentCharacter.isParticipating() && this.game.currentConflict.loser === this.parentCharacter.controller,
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
