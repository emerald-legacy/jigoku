import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class CentipedeTattoo extends DrawCard {
    static id = 'centipede-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'monk' });

        this.whileAttached({ effect: AbilityDsl.effects.addKeyword('tattooed') });

        this.whileAttached({
            condition: () =>
                !!this.attachedCharacter && !!this.game.currentConflict &&
                this.attachedCharacter.isParticipating() && this.game.currentConflict.loser === this.attachedCharacter.controller,
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
