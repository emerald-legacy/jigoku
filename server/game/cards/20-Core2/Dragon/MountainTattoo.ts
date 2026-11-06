import { addTrait, cardCannot } from '../../../effects.js';
import { Phase, RestrictionType, RestrictionScope, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MountainTattoo extends DrawCard {
    static id = 'mountain-tattoo';

    override setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: Trait.Monk });

        this.whileAttached({ effect: addTrait(Trait.Tattooed) });

        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.Target,
                appliesTo: RestrictionScope.OpponentsEvents,
                source: this
            })
        });

        this.whileAttached({
            condition: (context) => context.game.currentPhase !== Phase.Fate,
            effect: cardCannot({
                cannot: RestrictionType.Ready,
                source: this
            })
        });
    }
}
