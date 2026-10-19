import { Trait } from '../../../Constants.js';
import { setGlory } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class AncestralKabuto extends DrawCard {
    static id = 'ancestral-kabuto';

    public override setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Bushi });

        this.whileAttached({
            match: (card) => card.isDishonored,
            effect: setGlory(0)
        });

        this.reaction('Gain 1 honor')
            .when({
                afterConflict: (event, context) => !!context.source.parentCharacter && event.conflict.isOnWinningSide(context.source.parentCharacter) &&
                    context.source.parentCharacter.isDishonored
            })
            .gainHonor();
    }
}
