import { addTrait, cardCannot } from '../../../effects.js';
import { Phase, RestrictionType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MountainTattoo extends DrawCard {
    static id = 'mountain-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'monk' });

        this.whileAttached({ effect: addTrait('tattooed') });

        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.Target,
                restricts: 'opponentsEvents',
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
