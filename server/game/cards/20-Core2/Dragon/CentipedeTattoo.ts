import { Trait } from '../../../Constants.js';
import { addTrait, doesNotBow } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class CentipedeTattoo extends DrawCard {
    static id = 'centipede-tattoo';

    override setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Monk });

        this.whileAttached({ effect: addTrait(Trait.Tattooed) });

        this.whileAttached({
            condition: () =>
                !!this.parentCharacter && !!this.game.currentConflict &&
                this.parentCharacter.isParticipating() && this.game.currentConflict.loser === this.parentCharacter.controller,
            effect: doesNotBow()
        });
    }
}
