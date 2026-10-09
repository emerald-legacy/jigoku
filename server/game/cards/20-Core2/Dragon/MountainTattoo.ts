import { addTrait, cardCannot } from '../../../effects.js';
import { Phase, RestrictionType, RestrictionScope } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MountainTattoo extends DrawCard {
    static id = 'mountain-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'monk' });

        this.whileAttached({ effect: addTrait('tattooed') });

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
